import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import {
  fetchFriends,
  fetchFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendRequest,
  sendFriendRequest,
  clearFriendMessage,
} from "../features/friends/friendsSlice.js";

import {
  searchUsers,
  clearSearchResults,
} from "../features/users/usersSlice.js";

const FriendsPage = () => {
  const dispatch = useDispatch();
  const { loading, error, friends, requests, message } = useSelector(
    (state) => state.friends
  );

  const [query, setQuery] = useState("");
  const { results, loading: searchLoading } = useSelector(
    (state) => state.users
  );
  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchFriendRequests());
  }, [dispatch]);

  const handleAccept = (request) => {
    dispatch(acceptFriendRequest(request));
  };

  const handleReject = (userId) => {
    dispatch(rejectFriendRequest(userId));
  };

  const handleUnfriend = (userId) => {
    dispatch(unfriendRequest(userId));
  };

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      const obj = {query:value,context:'friends'}
      dispatch(searchUsers(obj));
    } else {
      dispatch(clearSearchResults());
    }
  };

  const handleSendRequest = (user) => {
    dispatch(sendFriendRequest(user.email));
    setQuery("");
    dispatch(clearSearchResults());
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Friends</h2>

      {/* Search Box with Suggestions */}
      <Form className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </InputGroup>
        {searchLoading && <div className="mt-2">Searching...</div>}
        {results.length > 0 && (
          <ListGroup className="shadow-sm">
            {results.map((user) => (
              <ListGroup.Item
                key={user._id}
                className="d-flex justify-content-between align-items-center"
              >
                <span>
                  {user.name} ({user.email})
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleSendRequest(user)}
                >
                  Send Request
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Form>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => clearFriendMessage()}
        >
          {error}
        </Alert>
      )}
      {message && (
        <Alert
          variant="success"
          dismissible
          onClose={() => clearFriendMessage()}
        >
          {message}
        </Alert>
      )}

      {!loading && !error && (
        <Row>
          {/* Friends Table */}
          <Col md={6} className="mb-4">
            <h4 className="text-center">Your Friends</h4>
            {friends.length === 0 ? (
              <p className="text-center">No friends yet.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {friends.map((friend) => (
                    <tr key={friend._id}>
                      <td>{friend.name}</td>
                      <td>{friend.email}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleUnfriend(friend._id)}
                        >
                          Unfriend
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>

          {/* Pending Requests Table */}
          <Col md={6} className="mb-4">
            <h4 className="text-center">Pending Requests</h4>
            {requests.length === 0 ? (
              <p className="text-center">No pending requests.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.name}</td>
                      <td>{request.email}</td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleAccept(request)}
                          className="me-2"
                        >
                          ✔
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleReject(request._id)}
                        >
                          ✖
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FriendsPage;
