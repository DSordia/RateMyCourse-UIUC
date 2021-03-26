import styled from 'styled-components'
import consts from './constants'

export const Nav = styled.nav`
  top: 0;
  left: 0;
  width: 100%;
  height: 55px;
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