import { ModalDiv, ModalNavX, AreYouSureTxt, BtnsDiv, AreYouSureBtn } from '../styles/styles'

const AreYouSureModal = props => {
    return (
        <ModalDiv>
            <ModalNavX onClick={props.closeAreYouSureModal}>X</ModalNavX>

            <AreYouSureTxt>
                Are you sure you want to delete this review? This action cannot be undone.
            </AreYouSureTxt>

            <BtnsDiv>
                <AreYouSureBtn onClick={() => { props.delete(); props.closeAreYouSureModal() }}>
                    Yes, delete review.
                </AreYouSureBtn>
                
                <AreYouSureBtn onClick={props.closeAreYouSureModal}>
                    No, Cancel.
                </AreYouSureBtn>
            </BtnsDiv>
        </ModalDiv> 
    )
  }
  
  export default AreYouSureModal