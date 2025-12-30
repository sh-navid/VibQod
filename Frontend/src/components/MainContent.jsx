import styled from "styled-components";
import { useState, useEffect } from "react";
import useAi from "../hooks/useAi";

const Chat = styled.div`
  overflow-y: auto;
  padding: 1rem;
  max-height: 100vh;
  width: 100%;
`;

const CodeBlock = styled.div`
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 10px;
  font-family: monospace;
  position: relative;
  max-height: ${(props) =>
    props.expanded ? "none" : "100px"};
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-top: 1rem;
`;

const BlockHeader = styled.span`
  color: #fdff70ff;
  font-size: 11px;

  & span{
    font-size: 18px;
    padding-right: .25rem;
  }

  * {
    display: inline-block;
    vertical-align: middle;
  }
`;

const CodeSnippet = styled.pre`
  color: #636363ff;
  font-size: 0.8rem;
  margin-top: 1rem;
  overflow-x: auto;
`;

const CodeIcons = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #483737ff;
  padding: 3px;
  border-radius: 4px;
  color: #fff;
  // visibility: hidden;
  opacity: 0.0;
  transition: all 300ms;
  user-select: none;

  ${CodeBlock}:hover & {
    visibility: visible;
    opacity: 0.9;
  }

  & .material-icons {
    font-size: 1rem !important;
    cursor: pointer;
  }

  & .material-icons:hover {
    color: gold;
  }
`;

const Separator = styled.div`
  border-top: 1px solid #212121ff;
  margin-top: 0rem;
  margin-bottom: 0rem;
`;

const Actions = styled.div`
  dispay: flex;
  text-align: center;
`;

const AcceptButton = styled.button`
  background: transparent;
  border-radius: 4px;
  color: #a3d67dff;
  padding: 8px 12px;
  cursor: pointer;
  border: none;
`;

const RejectButton = styled(AcceptButton)`
  color: #cc5cb6ff;
`;

const CommitButton = styled(AcceptButton)`
  color: #837abcff;
`;

const ToggleButton = styled.span`
  color: #837abcff;
  cursor: pointer;
  font-size: 10px;
  text-align:center;
  display: block;
  margin-top: 1rem;
  position: absolute;
  right: .5rem;
  bottom:.5rem;;
`;

const ResponseContainer = styled.div`
    padding: 1rem;
`;

const BlockType = styled.div`
  color: #f1912bff;
  font-size: .6rem;
  float: right;
`;

const Dir = styled.div`
  background-color: transparent;
  border: 2px solid #212121;
  padding-right: 0.75rem;
  padding-left: 0.75rem;
  display: inline-block;
  border-radius: 10rem;
  align-items: center;
  line-height: 1rem;
  padding: 0.25rem;
  font-size: 80%;
  display: flex;

  & .material-icons {
    line-height: 1rem;
    padding: 0.25rem;
    padding-left: 0;
    font-size: 1rem;
  }

  & .material-icons:last-child {
    padding-left: 0.25rem;
    padding-right: 0;
    color: tomato;
  }
`;

const CommitBlock = styled(CodeBlock)`
    background-color: #080808 !important;
    color: #2c2c2cff;
`

const DescriptionBlock = styled(CodeBlock)`
    background-color: #131313ff !important;
    color:#efefef;
`

const CommandHolder = styled.div`
    color: #4a4a4aff;
    font-size: .8rem;
    vertical-align: middle;
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const File = ({ children, isDir = false }) => {
  return (
    <>
      <Dir>
        <span className="material-icons">{isDir ? "folder" : "code"}</span>
        {children}
        <span className="material-icons">close</span>
      </Dir>
    </>
  );
};

const renderBlock = (block) => {
  if (block.type === "PROMPT") {
    return <CodeBlock>
      <BlockType>
        {block.type}
      </BlockType>
      {block.data}
      <CodeIcons>
        {/* Replay */}
        <span className="material-icons">replay</span>
        {/* Copy new changes */}
        <span className="material-icons">content_copy</span>
      </CodeIcons>
    </CodeBlock>
  }

  if (block.type === "COMMIT") {
    return <CommitBlock>
      <BlockType>
        {block.type}
      </BlockType> <BlockHeader>
        {block.subType}
      </BlockHeader>
      <br />
      {block.data}
      <CodeIcons>
        {/* Replace new content in file */}
        <span className="material-icons">terminal</span>
        {/* Copy new changes */}
        <span className="material-icons">content_copy</span>
      </CodeIcons>
    </CommitBlock>
  }

  if (block.subType.toUpperCase() === "DESCRIPTION") {
    return <DescriptionBlock>
      <BlockType>
        {block.type}
      </BlockType>
      <BlockHeader>
        {block.subType}
      </BlockHeader>
      <br />
      {block.data}
      <CodeIcons>
        {/* Copy new changes */}
        <span className="material-icons">content_copy</span>
      </CodeIcons>
    </DescriptionBlock>
  }

  return <>
    <CodeBlock expanded={false}>
      <BlockType>
        {block.type}
      </BlockType>
      <BlockHeader>
        {block.subType.startsWith("file:") ? <span className="material-icons">code</span> : null}
        {block.subType.replace("file:", "")}
      </BlockHeader>
      <CodeSnippet>
        {block.data}
      </CodeSnippet>
      <CodeIcons>
        {/* Open current file */}
        <span className="material-icons">file_open</span>
        {/* Replace new content in file */}
        <span className="material-icons">content_paste</span>
        {/* Copy new changes */}
        <span className="material-icons">content_copy</span>
        {/* Compare new content with old content */}
        <span className="material-icons">compare</span>
      </CodeIcons>
      <ToggleButton onClick={() => { }}>
        {false ? "Less..." : "More..."}
      </ToggleButton>
    </CodeBlock>
  </>
}

const MainContent = () => {
  const [expanded, setExpanded] = useState(false);
  const { history, isHistoryLoading, isError, error } = useAi();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (isError) {
      console.error("Error fetching history:", error);
    }
  }, [isError, error]);

  return (
    <Chat>
      {/* <ResponseContainer>
        <FileHolder>
          <File isDir={true}>src</File>
          <File>Main.jsx</File>
          <File>App.jsx</File>
        </FileHolder>
      </ResponseContainer> */}

      {isHistoryLoading && <p>Loading history...</p>}
      {(history && history.length > 0) ? (
        <div>
          <ul>
            {history.map((item, index) => (
              <ResponseContainer key={index}>
                {item.blocks.map((block, index) => (
                  <div key={index}>
                    {renderBlock(block)}
                  </div>
                ))}
                <br />
                {
                  (item.blocks && item.blocks.length > 0 && item.blocks[1]?.type != "PROMPT") ?
                    <>
                      <Actions>
                        <RejectButton>Reject</RejectButton>
                        <CommitButton>Commit</CommitButton>
                        <AcceptButton>Accept</AcceptButton>
                      </Actions>
                      <Separator />
                    </> : null
                }
              </ResponseContainer>
            ))}
          </ul>
        </div>
      ) : <>
        <CommandHolder>
          <span>Press <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd> to show desktop panel</span>
          <br />
          <span>Press <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>,</kbd> to minimize desktop panel</span>
        </CommandHolder>
      </>}
      <div style={{ height: "4rem" }}></div>
    </Chat>
  );
};

export default MainContent;
