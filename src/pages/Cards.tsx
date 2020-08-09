import {
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react'
import React, { FC } from 'react'

import Card from '../components/Card'
import { useAccounts } from '../store'

const Cards: FC = () => {
  const { accounts, isFetching, refresh } = useAccounts()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Investec Cards</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={isFetching} message="Fetching Accounts" />
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent />
        </IonRefresher>
        {Object.keys(accounts).map(
          accountId =>
            accounts[accountId] && (
              <Card account={accounts[accountId]} key={accountId} />
            )
        )}
      </IonContent>
    </IonPage>
  )
}

export default Cards
