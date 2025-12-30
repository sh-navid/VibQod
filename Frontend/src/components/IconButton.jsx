import styled from "styled-components";

export const IconButton = styled.a`
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none; /* remove underline from link */

  &:hover {
    background-color: rgba(255, 255, 255, 0.1); /* Subtle hover effect */
  }
`;