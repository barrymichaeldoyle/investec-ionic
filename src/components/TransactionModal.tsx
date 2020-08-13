import { Transaction } from 'investec-openapi/lib/interfaces'
import {
  IonModal,
  IonRow,
  IonContent,
  IonCardContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonLabel,
} from '@ionic/react'
import React, { FC, useCallback } from 'react'

import { useAccounts } from '../store'
import { useParams } from 'react-router'

interface Props {
  selectedTransaction?: Transaction
  setSelectedTransaction: (transaction?: Transaction) => void
}

const TransactionModal: FC<Props> = ({
  selectedTransaction,
  setSelectedTransaction,
}) => {
  const { accounts } = useAccounts()
  const { accountId } = useParams()

  const handleDismiss = useCallback(() => setSelectedTransaction(undefined), [
    setSelectedTransaction,
  ])

  return (
    <IonModal
      isOpen={!!selectedTransaction}
      onDidDismiss={handleDismiss}
      swipeToClose
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Details</IonTitle>
          <IonButtons onClick={handleDismiss} slot="end">
            <IonLabel color="primary" onClick={handleDismiss}>
              Close&nbsp;&nbsp;
            </IonLabel>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCardContent>
          <IonRow>
            <p style={{ fontWeight: 'bold' }}>Card Number:</p>
          </IonRow>
          <IonRow>
            <p>{selectedTransaction?.cardNumber}</p>
          </IonRow>
          <br />
          <IonRow>
            <p style={{ fontWeight: 'bold' }}>Description:</p>
          </IonRow>
          <IonRow>
            <p>{selectedTransaction?.description}</p>
          </IonRow>
          <br />
          <IonRow>
            <p style={{ fontWeight: 'bold' }}>Type:</p>
          </IonRow>
          <IonRow>
            <p>{selectedTransaction?.type}</p>
          </IonRow>
          <br />
          <IonRow>
            <p style={{ fontWeight: 'bold' }}>Amount:</p>
          </IonRow>
          <IonRow>
            <p>
              {selectedTransaction?.amount} {accounts[accountId]?.currency}
            </p>
          </IonRow>
          <br />
          <IonRow>
            <p style={{ fontWeight: 'bold' }}>Transaction Date:</p>
          </IonRow>
          <IonRow>
            <p>{selectedTransaction?.transactionDate}</p>
          </IonRow>
          <br />
          <IonRow>
            <p style={{ fontWeight: 'bold' }}>Posting Date:</p>
          </IonRow>
          <IonRow>
            <p>{selectedTransaction?.postingDate}</p>
          </IonRow>
        </IonCardContent>
      </IonContent>
    </IonModal>
  )
}

export default TransactionModal
