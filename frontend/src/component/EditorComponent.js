import React, { useState } from 'react';
import styled from 'styled-components';
import {
  faEdit,
  faTrash,
  faImage,
  faLink,
  faParagraph,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditorComponent = () => {
  const [content, setContent] = useState([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [editingLinkId, setEditingLinkId] = useState('');

  const handleAddParagraph = () => {
    const newContent = [...content];
    newContent.push({
      type: 'paragraph',
      content: '',
      id: Date.now().toString(),
    });
    setContent(newContent);
  };

  const handleAddLink = () => {
    setShowLinkModal(true);
  };

  const handleLinkModalClose = () => {
    setShowLinkModal(false);
    setLinkText('');
    setLinkUrl('');
  };
  const handleLinkModalSubmit = () => {
    if (editingLinkId) {
      const updatedContent = content.map((item) => {
        if (item.id === editingLinkId) {
          return { ...item, content: linkText, url: linkUrl };
        }
        return item;
      });
      setContent(updatedContent);
    } else {
      const newContent = [
        ...content,
        {
          type: 'link',
          content: linkText,
          url: linkUrl,
          id: Date.now().toString(),
        },
      ];
      setContent(newContent);
    }

    setShowLinkModal(false);
    setLinkText('');
    setLinkUrl('');
    setEditingLinkId(null);
  };

  const handleAddImage = () => {
    const newContent = [...content];
    newContent.push({
      type: 'image',
      content: '',
      id: Date.now().toString(),
    });
    setContent(newContent);
  };

  const handleParagraphChange = (event, id) => {
    const updatedContent = content.map((item) => {
      if (item.id === id) {
        return { ...item, content: event.target.value };
      }
      return item;
    });

    const filteredContent = updatedContent.filter(
      (item) => item.type !== 'paragraph' || item.content.trim() !== ''
    );

    setContent(filteredContent);
  };

  const handleLinkEdit = (id) => {
    const linkItem = content.find((item) => item.id === id);

    if (linkItem) {
      setLinkText(linkItem.content);
      setLinkUrl(linkItem.url);
      setShowLinkModal(true);
      setEditingLinkId(id);
    }
  };

  const handleLinkDelete = (id) => {
    const updatedContent = content.filter((item) => item.id !== id);
    setContent(updatedContent);
  };

  const renderContent = () => {
    return content.map((item) => {
      if (item.type === 'paragraph') {
        return (
          <p key={item.id}>
            <StyledTextarea
              autoFocus
              value={item.content}
              onChange={(event) => handleParagraphChange(event, item.id)}
              onInput={(event) => {
                event.target.style.height = 'auto';
                event.target.style.height = event.target.scrollHeight + 'px';
              }}
            />
          </p>
        );
      }
      if (item.type === 'link') {
        return (
          <LinkWrapper key={item.id}>
            <StyledLink href={item.url}>{item.content}</StyledLink>
            <LinkIcons>
              <IconWrapper onClick={() => handleLinkEdit(item.id)}>
                <FontAwesomeIcon icon={faEdit} />
              </IconWrapper>
              <IconWrapper onClick={() => handleLinkDelete(item.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </IconWrapper>
            </LinkIcons>
          </LinkWrapper>
        );
      }

      if (item.type === 'image') {
        return <img key={item.id} src={item.content} alt="Preview" />;
      }
      return null;
    });
  };

  return (
    <Wrapper>
      <ButtonContainer>
        <Button onClick={handleAddParagraph}>
          <FontAwesomeIcon icon={faParagraph} />
          Add Paragraph
        </Button>
        <Button onClick={handleAddLink}>
          <FontAwesomeIcon icon={faLink} />
          Add Link
        </Button>
        <Button onClick={handleAddImage}>
          <FontAwesomeIcon icon={faImage} />
          Add Image
        </Button>
      </ButtonContainer>
      <ContentWrapper>
        <h2>Live Preview:</h2>
        {renderContent()}
      </ContentWrapper>
      {showLinkModal && (
        <ModalContainer>
          <Modal>
            <h3>{editingLinkId ? 'Edit Link' : 'Add Link'}</h3>
            <TextInput
              placeholder="Enter link text"
              value={linkText}
              onChange={(event) => setLinkText(event.target.value)}
            />
            <TextInput
              placeholder="Enter link URL"
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
            />
            <ButtonContainer>
              <CancelButton onClick={handleLinkModalClose}>Cancel</CancelButton>
              <AddButton onClick={handleLinkModalSubmit}>
                {editingLinkId ? 'Update' : 'Add'}
              </AddButton>
            </ButtonContainer>
          </Modal>
        </ModalContainer>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 10px;

  svg {
    margin-right: 8px;
  }
`;

const ContentWrapper = styled.div`
  margin-top: 20px;
`;

const StyledTextarea = styled.textarea`
  /* Add your textarea styles here */
  border: none;
  border-radius: 4px;
  padding: 8px;
  margin: 0;
  background-color: transparent;
  resize: none;
  width: 100%;
  transition: box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }
`;

const TextInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
`;

const AddButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: #000;
  margin-right: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const LinkIcons = styled.div`
  display: flex;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  margin-left: 5px;

  &:first-child {
    margin-left: 0;
  }
`;

export default EditorComponent;
