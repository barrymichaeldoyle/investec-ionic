import { Transaction } from 'investec-openapi/lib/interfaces'
import { IonItem, IonLabel } from '@ionic/react'
import React, { FC, useCallback } from 'react'

interface Props {
  onClick: (transaction: Transaction) => void
  transaction: Transaction
}

const TransactionComponent: FC<Props> = ({ onClick, transaction }) => {
  const handleClick = useCallback(() => onClick(transaction), [
    onClick,
    transaction,
  ])

  return (
    <IonItem
      color={transaction.type === 'DEBIT' ? 'danger' : 'success'}
      onClick={handleClick}
    >
      <IonLabel style={{ maxWidth: 90 }}>
        <h6>{transaction.postingDate}</h6>
      </IonLabel>
      <IonLabel>
        <h6>{transaction.description}</h6>
      </IonLabel>
      <IonLabel style={{ maxWidth: 60, textAlign: 'right' }}>
        <h6>{Math.ceil(transaction.amount)}</h6>
      </IonLabel>
    </IonItem>
  )
}

export default TransactionComponent
