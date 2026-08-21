from datetime import datetime, timedelta
from decimal import Decimal

from sqlalchemy import select

from app.database.base import Base
from app.database.session import SessionLocal, engine
from app.models import PaymentMethod, Recipient, Transaction, TransactionStatus, TransactionType, User


DEMO_USER = {
    'name': 'Arjun Mehta',
    'phone': '+91 98XXXXXX42',
    'email': 'arjun.demo@safepay.test',
    'avatar': 'AM',
}

RECIPIENTS = [
    ('Rahul Sharma', 'rahul.sharma@upi', '+91 9000000001', 'RS', True),
    ('Priya Reddy', 'priya.reddy@upi', '+91 9000000002', 'PR', True),
    ('Arjun Kumar', 'arjun.kumar@upi', '+91 9000000003', 'AK', False),
    ('Mom', 'mom.demo@upi', '+91 9000000004', 'M', True),
    ('Local Kirana Store', 'kirana.demo@upi', '+91 9000000005', 'LK', True),
    ('Demo Merchant', 'merchant.demo@upi', None, 'DM', False),
    ('Swiggy Demo', 'swiggy.demo@upi', None, 'SD', False),
    ('Safe Electricity Board', 'electricity.demo@upi', None, 'EB', False),
    ('Metro Recharge Demo', 'metro.demo@upi', None, 'MR', False),
]


def initialize_database() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as database_session:
        if database_session.scalar(select(User.id).limit(1)) is not None:
            existing_upi_ids = set(database_session.scalars(select(Recipient.upi_id)).all())
            for name, upi_id, phone, avatar, is_favorite in RECIPIENTS:
                if upi_id not in existing_upi_ids:
                    database_session.add(Recipient(name=name, upi_id=upi_id, phone=phone, avatar=avatar, is_favorite=is_favorite))
            database_session.commit()
            return

        user = User(**DEMO_USER)
        database_session.add(user)
        database_session.flush()
        recipient_by_upi: dict[str, Recipient] = {}
        for name, upi_id, phone, avatar, is_favorite in RECIPIENTS:
            recipient = Recipient(name=name, upi_id=upi_id, phone=phone, avatar=avatar, is_favorite=is_favorite)
            database_session.add(recipient)
            recipient_by_upi[upi_id] = recipient
        database_session.flush()

        rahul = recipient_by_upi['rahul.sharma@upi']
        priya = recipient_by_upi['priya.reddy@upi']
        mom = recipient_by_upi['mom.demo@upi']
        kirana = recipient_by_upi['kirana.demo@upi']
        swiggy = recipient_by_upi['swiggy.demo@upi']
        electricity = recipient_by_upi['electricity.demo@upi']
        metro = recipient_by_upi['metro.demo@upi']
        now = datetime(2026, 8, 21, 13, 42)
        entries = [
            (rahul, 500, TransactionType.SEND, TransactionStatus.SUCCESS, 'Dinner split', 1),
            (rahul, 700, TransactionType.SEND, TransactionStatus.SUCCESS, 'Movie tickets', 4),
            (rahul, 1000, TransactionType.SEND, TransactionStatus.SUCCESS, 'Weekend plans', 8),
            (rahul, 800, TransactionType.SEND, TransactionStatus.SUCCESS, 'Cab share', 12),
            (rahul, 25000, TransactionType.SEND, TransactionStatus.SUCCESS, 'Urgent transfer demo', 16),
            (rahul, 1200, TransactionType.RECEIVE, TransactionStatus.SUCCESS, 'Weekend plans', 0),
            (priya, 780, TransactionType.SEND, TransactionStatus.SUCCESS, 'Household supplies', 1),
            (priya, 650, TransactionType.SEND, TransactionStatus.SUCCESS, 'Cafe payment', 7),
            (priya, 920, TransactionType.SEND, TransactionStatus.PENDING, 'Shared booking', 15),
            (mom, 3000, TransactionType.SEND, TransactionStatus.SUCCESS, 'Monthly support', 3),
            (mom, 2500, TransactionType.SEND, TransactionStatus.SUCCESS, 'Monthly support', 31),
            (kirana, 350, TransactionType.SEND, TransactionStatus.SUCCESS, 'Groceries', 2),
            (kirana, 480, TransactionType.SEND, TransactionStatus.SUCCESS, 'Groceries', 9),
            (kirana, 620, TransactionType.SEND, TransactionStatus.SUCCESS, 'Groceries', 18),
            (swiggy, 486, TransactionType.SEND, TransactionStatus.SUCCESS, 'Lunch order', 0),
            (electricity, 1425, TransactionType.BILL_PAYMENT, TransactionStatus.SUCCESS, 'July bill', 9),
            (electricity, 1360, TransactionType.BILL_PAYMENT, TransactionStatus.SUCCESS, 'June bill', 39),
            (metro, 500, TransactionType.RECHARGE, TransactionStatus.FAILED, 'Monthly pass', 11),
            (metro, 500, TransactionType.RECHARGE, TransactionStatus.SUCCESS, 'Monthly pass', 41),
            (priya, 1100, TransactionType.SEND, TransactionStatus.SUCCESS, 'Dinner booking', 52),
            (kirana, 300, TransactionType.SEND, TransactionStatus.SUCCESS, 'Snacks', 59),
        ]
        for index, (recipient, amount, transaction_type, status, note, days_ago) in enumerate(entries, start=1):
            created_at = now - timedelta(days=days_ago, minutes=index * 3)
            database_session.add(Transaction(
                user_id=user.id,
                recipient_id=recipient.id,
                recipient_name=recipient.name,
                recipient_upi_id=recipient.upi_id,
                amount=Decimal(str(amount)),
                transaction_type=transaction_type,
                status=status,
                payment_method=PaymentMethod.WALLET if index % 3 else PaymentMethod.UPI,
                note=note,
                transaction_reference=f'SPTXN-2026-{index:06d}',
                created_at=created_at,
            ))
        database_session.commit()


if __name__ == '__main__':
    initialize_database()
    print('SafePay demo database initialized with synthetic data.')
