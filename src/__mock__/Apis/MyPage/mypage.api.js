import { rest } from 'msw'
import bankMock from '../../Data/MyPage/bank.data'

export const getBankList = rest.get(
	'/api/user/my-page/account-book',
	async (req, res, ctx) => {
		const page = req.url.searchParams.get('page') || 1
		const category = req.url.searchParams.get('category')
		const start = req.url.searchParams.get('start')
		const end = req.url.searchParams.get('end')

		const filteredPayList = bankMock.payList.filter(
			data => data.createdAt >= start && data.createdAt <= end,
		)

		const slicePayList = filteredPayList.slice(
			(page - 1) * 20,
			(page - 1) * 20 + 20,
		)

		const makeData = {
			...bankMock,
			payList: slicePayList,
			count: filteredPayList.length,
		}

		return res(ctx.status(200), ctx.json(makeData))
	},
)
