import api from 'investec-openapi'
import { Account, AccountBalance } from 'investec-openapi/lib/interfaces'
import { RefresherEventDetail } from '@ionic/core'
import { IonToast } from '@ionic/react'
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

api.configure({
  clientId: process.env.REACT_APP_CLIENT_ID ?? '',
  proxyUrl: process.env.REACT_APP_PROXY_URL ?? '',
  secret: process.env.REACT_APP_SECRET ?? '',
})

interface Accounts {
  [key: string]: Account & AccountBalance
}

interface ContextProps {
  accounts: Accounts
  isFetching: boolean
  refresh: () => void
  setErrMessage: (msg: string) => void
}

const Context = createContext<ContextProps>({
  accounts: {},
  isFetching: false,
  refresh: () => null,
  setErrMessage: () => null,
})

export const Provider: FC = ({ children }) => {
  const [accounts, setAccounts] = useState<Accounts>({})
  const [errMessage, setErrMessage] = useState('')
  const [isFetching, setIsFetching] = useState(true)

  const refresh = useCallback((event?: CustomEvent<RefresherEventDetail>) => {
    api.getAccounts().then(res => {
      if (res) {
        const promises: Promise<void>[] = []
        res.data.accounts.forEach(account => {
          promises.push(
            api
              .getAccountBalance({ accountId: account.accountId })
              .then(res => {
                if (res)
                  setAccounts(previousAccounts => ({
                    ...previousAccounts,
                    [account.accountId]: { ...account, ...res.data },
                  }))
                else setErrMessage('Failed to Fetch Balances!')
              })
          )
          Promise.all(promises).then(
            () => event?.detail.complete() ?? setIsFetching(false)
          )
        })
      } else {
        setErrMessage('Failed to Fetch Accounts!')
        event?.detail.complete() ?? setIsFetching(false)
      }
    })
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <Context.Provider value={{ accounts, isFetching, refresh, setErrMessage }}>
      {children}
      <IonToast
        isOpen={errMessage.length > 0}
        onDidDismiss={() => setErrMessage('')}
        message={errMessage}
        duration={3000}
      />
    </Context.Provider>
  )
}

export function useAccounts() {
  return useContext<ContextProps>(Context)
}
