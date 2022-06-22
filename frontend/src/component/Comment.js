import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { Store } from '../Store';
import { getError } from '../utils';

const Container = styled.div`
  margin-top: 15px;
  border-radius: 0.2rem;
  padding: 20px;
  display: flex;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
`;
const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;
const SmallImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;
const Content = styled.div`
  margin-left: 20px;
`;
const Name = styled.div`
  font-weight: bold;
  margin-right: 10px;
`;
const CommentText = styled.div`
  margin-bottom: 10px;
`;
const Action = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 125px;
  &.reply {
    width: 125px;
  }
`;
const Reply = styled.div`
  font-size: 13px;
  cursor: pointer;
  &:hover {
    color: var(--malon-color);
  }
`;
const Like = styled.div`
  font-size: 13px;
`;
const Time = styled.div`
  font-size: 12px;
`;
const Top = styled.div`
  display: flex;
  align-items: center;
`;
const Button = styled.button`
  margin-left: 90px;
  border: 0;
  background: var(--orange-color);
  color: var(--white-color);
  padding: 1px 7px;
  font-size: 12px;
  border-radius: 0.2rem;
`;
const SubCont = styled.div`
  padding: 20px;
  display: flex;
  margin: 5px 0 5px 90px;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
`;
const Textarea = styled.textarea`
  margin: 10px 0 0 90px;
  width: 100%;
  padding: 10px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
    border: 1px solid var(--orange-color);
    box-shadow: 0 0 0 0.25rem rgb(247 154 35 / 10%);
  }
`;

export default function Comment({ commentC }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;
  const [comment, setComment] = useState(commentC);
  const [reply, setReply] = useState('');
  const [replyArea, setReplyArea] = useState(false);

  const likeComment = async (id) => {
    if (comment.name === userInfo.name) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: "You can't like your product",
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      return;
    }
    if (comment.likes.find((x) => x === userInfo._id)) {
      try {
        const { data } = await axios.put(`/api/comments/${id}/unlike`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setComment(data.comment);
        ctxDispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: 'Item unliked',
            showStatus: true,
            state1: 'visible1 error',
          },
        });
      } catch (err) {
        console.log(getError(err));
      }
    } else {
      try {
        const { data } = await axios.put(`/api/comments/${id}/like`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setComment(data.comment);
        ctxDispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: 'Comment Liked',
            showStatus: true,
            state1: 'visible1 success',
          },
        });
      } catch (err) {
        console.log(getError(err));
      }
    }
  };

  const submitReplyHandler = async (e) => {
    e.preventDefault();
    if (!reply) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Enter a reply',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/comments/reply/${comment._id}`,
        {
          reply,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setComment(data.comment);
    } catch (err) {
      console.log(getError(err));
    }
  };

  return (
    <>
      <Container mode={mode}>
        <Image src="/images/pimage.png" alt="pimage" />
        <Content>
          <Top>
            <Name>{comment.name}</Name>
            <Time>{format(comment.createdAt)}</Time>
          </Top>
          <CommentText>{comment.comment}</CommentText>
          <Action>
            <Reply onClick={() => setReplyArea(!replyArea)}>
              {comment.replies.length} reply
            </Reply>
            <Like>{comment.likes.length} like</Like>
            <FontAwesomeIcon
              icon={faHeart}
              onClick={() => likeComment(comment._id)}
            />
          </Action>
        </Content>
      </Container>
      {replyArea && (
        <>
          {comment.replies.map((r) => (
            <SubCont mode={mode}>
              <SmallImage src="/images/pimage.png" alt="pimage" />
              <Content>
                <Top>
                  <Name>{r.name}</Name>
                  <Time>{format(r.createdAt)}</Time>
                </Top>
                <CommentText>{r.comment}</CommentText>
                <Action className="reply">
                  <Like>{r.likes.length} like</Like>
                  <FontAwesomeIcon icon={faHeart} />
                </Action>
              </Content>
            </SubCont>
          ))}
          <form onSubmit={submitReplyHandler}>
            <Textarea
              placeholder="Leave a reply here"
              className={` ${mode === 'pagebodydark' ? '' : 'color_black'}`}
              onChange={(e) => setReply(e.target.value)}
            />
            <div>
              <Button className="reply" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </>
      )}
    </>
  );
}
