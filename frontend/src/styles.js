import styled from 'styled-components'
import consts from './constants'

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
  color: ${consts.ORANGE};
  font-size: 1.06rem;
  margin-left: 1.5%;
  text-decoration: none;
  cursor: default;
`
export const GoogleDiv = styled.div`
  margin-right: 2%;
`
export const TabsDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: grey;
  height: 65px;
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