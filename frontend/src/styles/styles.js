import styled from 'styled-components'
import consts from '../constants'

export const Nav = styled.nav`
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: ${consts.BLUE};
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const NavTitle = styled.a`
  color: ${consts.GREY};
  font-size: 1.06rem;
  margin-left: 1.5%;
  text-decoration: none;
  cursor: default;
`
export const GoogleDiv = styled.div`
  margin-right: 2%;
`
export const LoginText = styled.div`
  margin-top: 2.5%;
  font-size: 1.9rem;
`
export const TabsDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${consts.GREY};
  height: 60px;
`
export const TabBtn = styled.a`
  font-weight: ${props => props.selected ? 600 : 300};
  padding: 7px;
  cursor: pointer;
  font-size: 1.1rem;
  color: black;
  text-decoration: underline;
`
export const Divider = styled.span`
  margin-left: 2%;
  margin-right: 2%;
  font-size: 2.8rem;
  font-weight: 700;
`
export const SearchDropdownDiv = styled.div`
  margin: 0 auto;
  width: 20%;
  margin-bottom: 1.5%;
`
export const DropdownDiv = styled.div`
  margin: 1% auto;
  width: 40%;
`
export const DropdownHeading = styled.div`
  margin-top: 7%;
  margin-bottom: 7%;
  font-size: 1.1rem;
`
export const SelectedCourseInfoDiv = styled.div`
  font-size: 1.2rem;
`
export const SearchReviewDiv = styled.div`
  background-color: ${consts.GREY};
  width: 50%;
  margin: 2.5% auto;
`
export const ReviewDiv = styled.div`
  background-color: ${consts.GREY};
  width: 60%;
  margin: 2.5% auto;
  height: 700px;
`
export const SearchReviewHeading = styled.div`
  padding-top: 1%;
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: underline;
`
export const ReviewHeading = styled.div`
  padding-top: 1%;
  font-size: 1.19rem;
  font-weight: 700;
`
export const ProfessorText = styled.div`
  padding-top: 1%;
  font-size: 1.05rem;
`
export const HR1 = styled.hr`
  width: 55%;
  border-top: 0.5px solid black;
  opacity: 30%;
`
export const HR2 = styled.hr`
  width: 30%;
  border-top: 0.5px solid black;
  opacity: 30%;
`
export const OverallCourseRatingText = styled.div`
  font-size: 1.7rem;
  font-weight: 700;
  padding-top: 1%;
`
export const OverallRatingText = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
`
export const ReviewsHeading = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: -1%;
`
export const ReviewRatingText = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
`
export const ProfessorRatingText = styled.div`
  font-size: 1.12rem;
  padding-top: 0.8%;
`
export const ReviewText = styled.div`
  width: 80%;
  margin: 2% auto;
  padding-bottom: 5%;
`
export const ReviewTextArea = styled.textarea`
  margin-top: 1%;
  width: 55%;
  height: 35%;
  resize: none;
  overflow: visible;
  font-family: 'Roboto';
`
export const SubmitButton = styled.button`
    background: ${consts.GREY};
    padding: 12px 22px;
    text-decoration: none;
    margin-bottom: 4%;
    font-size: 1.2rem;
    cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
    outline: none;
    transition: .4s;
    :hover {
      background: ${consts.LIGHT_GREY};
    }
`
export const DeleteButton = styled.button`
    background: ${consts.GREY};
    padding: 4px 10px;
    float: right;
    margin-top: -2%;
    margin-right: 2%;
    text-decoration: none;
    margin-bottom: 4%;
    font-size: 1rem;
    cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
    outline: none;
    transition: .4s;
    :hover {
      background: ${consts.LIGHT_GREY};
    }
`
export const AfterSubmit = styled.div`
  margin-top: -2%;
  padding-bottom: 2%;
`
export const ModalDiv = styled.div`
    position: absolute;
    z-index: 1;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    height: 200px;
    justify-content: space-between;
    flex-direction: column;
    background-color: ${consts.BLUE};
    color: white;
    @media (max-width: 480px) { width: 85% }
    @media (min-width: 480px) and (max-width: 768px) { width: 60% }
    @media (min-width: 768px) and (max-width: 1200px) { width: 45%; }
    @media (min-width: 1200px) { width: 35%; }
`
export const ModalNavX = styled.a`
    color: ${consts.GREY};
    font-size: 1.6rem;
    font-weight: 600;
    text-decoration: none;
    align-self: flex-end;
    margin-right: 2%;
    transform: scaleX(1.1) scaleY(0.9);
    cursor: pointer;
    transition: .4s;
    :hover {
        color: ${consts.LIGHT_GREY};
    }
`
export const AreYouSureTxt = styled.div`
    width: 75%;
    align-self: center;
    padding-bottom: 50px:
`
export const BtnsDiv = styled.div`
    display: flex;
    justify-content: center;
    padding-top: 4%;
    margin-bottom: 5%;
`
export const AreYouSureBtn = styled.button`
    background: ${consts.GREY};
    padding: 5px 10px;
    margin: 0 2%;
    text-decoration: none;
    font-size: 0.95rem;
    transition: .4s;
    cursor: pointer;
    outline: none;
    :hover {
        background: ${consts.LIGHT_GREY};
    }
    @media (max-width: 480px) { width: 40%; }
    @media (min-width: 480px) and (max-width: 768px) { width: 35%; }
    @media (min-width: 768px) and (max-width: 1200px) { width: 30%; }
    @media (min-width: 1200px) { width: 25%; }
`
export const ThumbsDiv = styled.div`
    display: flex;
    margin-top: -20px;
    justify-content: space-between;
    padding-left: 4%;
    padding-right: 4%;
    padding-bottom: 1%;
`
export const ThumbsUpStyle = {
  color: 'green',
  cursor: 'pointer',
  paddingBottom: '5px'
}

export const ThumbsDownStyle = {
  color: 'red',
  cursor: 'pointer',
  paddingBottom: '5px'
}