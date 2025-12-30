import styled from "styled-components";
import Logo from "./../assets/logos/Logo.svg";

const CommandHolder = styled.div`
  font-size: 80%;
  margin-top: 10rem;
`;

export const LogoZone = () => {
  return (
    <center>
      <CommandHolder>
        <img src={Logo} width="110rem" />
        <br />
        <h3>Start to code with N8Code</h3>
        <span>
          <kbd>Prompt</kbd> | <kbd>/Command</kbd> | <kbd>@Attach</kbd>
        </span>
      </CommandHolder>
      <div
        role="log"
        id="chatMessages"
        aria-live="polite"
        aria-relevant="additions"
      ></div>
    </center>
  );
};
