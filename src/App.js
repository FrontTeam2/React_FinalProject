import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import GlobalStyles from './Styles/global'
import theme from './Styles/theme'
import router from './Routes/router'

import { RecoilRoot } from 'recoil'

// import { worker } from './__mock__/browser'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SocketProvider from './Context/socket'

function App() {
	// worker.start()
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: false,
			},
		},
	})

	return (
		<QueryClientProvider client={queryClient}>
			<RecoilRoot>
				<ThemeProvider theme={theme}>
					<SocketProvider>
						<GlobalStyles />
						<RouterProvider router={router} />
					</SocketProvider>
				</ThemeProvider>
			</RecoilRoot>
			<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
		</QueryClientProvider>
	)
}

export default App
