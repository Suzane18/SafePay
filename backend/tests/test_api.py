from fastapi.testclient import TestClient

from app.database.init_db import initialize_database
from app.main import app


initialize_database()
client = TestClient(app)


def test_get_demo_user() -> None:
    response = client.get('/api/users/me')
    assert response.status_code == 200
    assert response.json()['name'] == 'Arjun Mehta'


def test_get_recipients() -> None:
    response = client.get('/api/recipients')
    assert response.status_code == 200
    assert len(response.json()) >= 5


def test_get_transactions_with_filters() -> None:
    response = client.get('/api/transactions?limit=20')
    assert response.status_code == 200
    assert len(response.json()) >= 20

    filtered_response = client.get('/api/transactions?search=Rahul&status=SUCCESS')
    assert filtered_response.status_code == 200
    assert all('Rahul' in item['recipient_name'] for item in filtered_response.json())


def test_get_transaction_by_id() -> None:
    transaction_id = client.get('/api/transactions?limit=1').json()[0]['id']
    response = client.get(f'/api/transactions/{transaction_id}')
    assert response.status_code == 200
    assert response.json()['id'] == transaction_id


def test_invalid_transaction_id() -> None:
    response = client.get('/api/transactions/99999999')
    assert response.status_code == 404


def test_invalid_recipient_id() -> None:
    response = client.get('/api/recipients/99999999')
    assert response.status_code == 404


def test_invalid_payment_amount() -> None:
    response = client.post('/api/payments/simulate', json={'recipient_id': 1, 'amount': 0, 'note': 'Invalid'})
    assert response.status_code == 422


def test_simulate_payment() -> None:
    response = client.post('/api/payments/simulate', json={'recipient_id': 1, 'amount': 1000, 'note': 'Dinner'})
    assert response.status_code == 200
    body = response.json()
    assert body['success'] is True
    assert body['transaction']['amount'] == 1000
    assert body['transaction']['status'] == 'SUCCESS'
    assert body['transaction']['transaction_reference'].startswith('SPTXN-SIM-')


def test_risk_evaluation_does_not_create_transaction() -> None:
    before_count = len(client.get('/api/transactions?limit=100').json())
    response = client.post('/api/risk/evaluate', json={'recipient_id': 1, 'amount': 800, 'note': 'Risk only'})
    after_count = len(client.get('/api/transactions?limit=100').json())

    assert response.status_code == 200
    assert after_count == before_count


def test_risk_evaluation_invalid_recipient() -> None:
    response = client.post('/api/risk/evaluate', json={'recipient_id': 99999999, 'amount': 800})
    assert response.status_code == 404


def test_risk_evaluation_invalid_amounts() -> None:
    for amount in (0, -1):
        response = client.post('/api/risk/evaluate', json={'recipient_id': 1, 'amount': amount})
        assert response.status_code == 422
