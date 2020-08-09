import api from 'investec-openapi'
import { Transaction } from 'investec-openapi/lib/interfaces'
import { RefresherEventDetail } from '@ionic/core'
import {
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonDatetime,
  IonIcon,
} from '@ionic/react'
import { arrowForward } from 'ionicons/icons'
import React, {
  Children,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useParams } from 'react-router'

import { useAccounts } from '../store'
import Card from '../components/Card'
import TransactionComponent from '../components/Transaction'
import TransactionModal from '../components/TransactionModal'

const today = new Date().toISOString()
const startOfMonthArr = today.split('')
startOfMonthArr[8] = '0'
startOfMonthArr[9] = '1'
const startOfMonth = startOfMonthArr.join('')

const Transactions: FC = () => {
  const { accounts, setErrMessage, refresh: refreshAccounts } = useAccounts()
  const { accountId } = useParams()
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [fromDate, setFromDate] = useState(startOfMonth)
  const [toDate, setToDate] = useState(today)
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | undefined
  >()

  const getTransactions = useCallback(
    (event?: CustomEvent<RefresherEventDetail>) => {
      if (!event) setIsFetchingTransactions(true)
      api
        .getAccountTransactions({
          accountId,
          fromDate: fromDate.substr(0, fromDate.indexOf('T')),
          toDate: toDate.substr(0, fromDate.indexOf('T')),
        })
        .then(res => {
          if (res)
            setTransactions(
              res.data.transactions.sort((a, b) =>
                a.postingDate > b.postingDate
                  ? -1
                  : a.postingDate < b.postingDate
                  ? 1
                  : 0
              )
            )
          else setErrMessage('Failed to Fetch Balances!')
        })
        .finally(
          () => event?.detail.complete() ?? setIsFetchingTransactions(false)
        )
    },
    [accountId, fromDate, setErrMessage, toDate]
  )

  const refresh = useCallback(
    (event?: CustomEvent<RefresherEventDetail>) => {
      refreshAccounts()
      getTransactions(event)
    },
    [getTransactions, refreshAccounts]
  )

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    getTransactions()
  }, [fromDate, getTransactions, toDate])

  console.log({ accounts, transactions })

  const handleFromChange = useCallback(
    ({ detail }) => setFromDate(detail.value),
    []
  )
  const handleToChange = useCallback(
    ({ detail }) => setToDate(detail.value),
    []
  )

  const handleTransactionClick = useCallback(
    transaction => setSelectedTransaction(transaction),
    []
  )

  const moneyIn = useMemo(() => {
    let sum = 0
    transactions.forEach(({ amount, type }) => {
      if (type === 'CREDIT') sum += amount
    })
    return sum
  }, [transactions])
  const moneyOut = useMemo(() => {
    let sum = 0
    transactions.forEach(({ amount, type }) => {
      if (type === 'DEBIT') sum += amount
    })
    return sum
  }, [transactions])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Transactions</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading
          isOpen={isFetchingTransactions}
          message="Fetching Transactions"
        />
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent />
        </IonRefresher>
        <TransactionModal
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
        />
        <IonList>
          {accounts[accountId] && <Card account={accounts[accountId]} />}
          <IonItem>
            <IonDatetime
              displayFormat="D MMM YYYY"
              onIonChange={handleFromChange}
              placeholder="From Date"
              style={{ flex: 1, textAlign: 'center' }}
              value={fromDate}
            />
            <IonIcon icon={arrowForward} />
            <IonDatetime
              displayFormat="D MMM YYYY"
              onSelect={handleToChange}
              placeholder="To Date"
              style={{ flex: 1, textAlign: 'center' }}
              value={toDate}
            />
          </IonItem>
          {Children.toArray(
            transactions.map(transaction => (
              <TransactionComponent
                onClick={handleTransactionClick}
                transaction={transaction}
              />
            ))
          )}
          <IonItem>
            <IonLabel>
              <h6 style={{ textAlign: 'center' }}>
                <strong>Money In:</strong>
              </h6>
            </IonLabel>
            <IonLabel>
              <h6 style={{ textAlign: 'center' }}>
                <strong>Money Out:</strong>
              </h6>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h6 style={{ color: 'green', textAlign: 'center' }}>
                <strong>{Math.floor(moneyIn)}</strong>
              </h6>
            </IonLabel>
            <IonLabel>
              <h6 style={{ color: 'red', textAlign: 'center' }}>
                <strong>{Math.ceil(moneyOut)}</strong>
              </h6>
            </IonLabel>
          </IonItem>
          <IonItem>
            <strong style={{ flex: 1, textAlign: 'center' }}>
              Difference:&nbsp;&nbsp;
              <span style={{ color: moneyIn - moneyOut > 0 ? 'green' : 'red' }}>
                {Math.abs(Math.round(moneyIn - moneyOut))}
              </span>
            </strong>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Transactions
