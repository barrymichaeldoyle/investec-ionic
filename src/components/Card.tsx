import { Account, AccountBalance } from 'investec-openapi/lib/interfaces'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonRow,
} from '@ionic/react'
import React, { FC } from 'react'

interface Props {
  account: Account & AccountBalance
}

const Card: FC<Props> = ({ account }) => (
  <IonCard routerLink={`/transactions/${account.accountId}`}>
    <IonCardHeader color="primary">
      <IonCardSubtitle style={{ textAlign: 'cneter' }}>
        {account.referenceName}
      </IonCardSubtitle>
    </IonCardHeader>
    <IonCardContent>
      <IonCardSubtitle style={{ textAlign: 'center', margin: '15px 0 10px 0' }}>
        {account.productName}
      </IonCardSubtitle>
      <IonRow>
        <h3 style={{ flex: 1, fontWeight: 'bold' }}>Account Number:</h3>
        <h3>{account.accountNumber}</h3>
      </IonRow>
      <IonRow>
        <h3 style={{ flex: 1, fontWeight: 'bold' }}>Current Balance:</h3>
        <h3>
          {Math.floor(account.currentBalance)} {account.currency}
        </h3>
      </IonRow>
      <IonRow>
        <h3 style={{ flex: 1, fontWeight: 'bold' }}>Available Balance:</h3>
        <h3>
          {Math.floor(account.availableBalance)} {account.currency}
        </h3>
      </IonRow>
    </IonCardContent>
  </IonCard>
)

export default Card
