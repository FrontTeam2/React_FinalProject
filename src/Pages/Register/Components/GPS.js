import DaumPostcode from 'react-daum-postcode'
import styled from 'styled-components'
import { FlexCenterCSS } from '../../../Styles/common'
import { useSetRecoilState } from 'recoil'
import { isOpenModalAtom } from '../../../Atoms/modal.atom'

function GPS({ setResultAddress }) {
	const setIsOpenModal = useSetRecoilState(isOpenModalAtom)

	const gpsSelect = data => {
		setIsOpenModal(false)
		let ResultAddress = data.sido + ' ' + data.sigungu + ' ' + data.bname
		setResultAddress(ResultAddress)
		document.body.style.overflow = 'auto'
	}

	return (
		<Wrapper>
			<DaumPostcode onComplete={gpsSelect} autoClose />
		</Wrapper>
	)
}
export default GPS

const Wrapper = styled.div`
	${FlexCenterCSS}
	padding-top: 20px;
`
