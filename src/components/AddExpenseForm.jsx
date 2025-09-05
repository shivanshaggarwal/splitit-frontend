import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExpense,
  fetchAllExpenses,
} from "../features/expenses/expenseSlice.js";
import { fetchGroups } from "../features/group/groupSlice.js";
import { fetchFriends } from "../features/friends/friendsSlice.js";
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddExpenseForm = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { friends } = useSelector((state) => state.friends);
  const { groups } = useSelector((state) => state.groups);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState("");
  const [splitWith, setSplitWith] = useState([]);
  const [paidBy, setPaidBy] = useState(""); // default to "Me"
  const [message, setMessage] = useState(null);
  const [showAddFriendsButton, setShowAddFriendsButton] = useState(false);
  const [showMakeGroupButton, setShowMakeGroupButton] = useState(false);

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchFriends());

    if (friends.length < 1) {
      setShowAddFriendsButton(true);
    }
    if (groups.length < 1) {
      setShowMakeGroupButton(true);
    }
    if (user) {
      setPaidBy(user._id);
    }
  }, [user, dispatch]);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const expenseData = {
      amount: Number(amount),
      description,
      paidBy,
      groupId: groupId || undefined,
      splitBetween: !groupId ? splitWith : [],
    };
    
    dispatch(addExpense(expenseData)).then((res) => {
    console.log(55);
      if (!res.error) {
        setMessage("Expense added successfully");
        setAmount("");
        setDescription("");
        setGroupId("");
        setSplitWith([]);
        setPaidBy(user._id);
      }
    });
  };

  const handleToggleFriend = (friendId) => {
    setSplitWith((prev) => {
      const updated = prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId];
      return updated;
    });
  };

  const getPayerOptions = () => {
    let members = [{ _id: user._id, name: "Me" }];

    if (groupId) {
      const group = groups.find((g) => g._id === groupId);
      if (group) members = [...group.members];
    } else {
      members = [
        { _id: user._id, name: "Me" },
        ...friends.filter((f) => splitWith.includes(f._id)),
      ];
    }

    return members;
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded shadow">
      <h4 className="mb-3">Add New Expense</h4>

      {message && <Alert variant="success">{message}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Split With (Friends)</Form.Label>
            <div
              className="border rounded p-2"
              style={{ maxHeight: "150px", overflowY: "auto" }}
            >
              {friends.length > 0 &&
                friends.map((friend) => (
                  <Form.Check
                    key={friend._id}
                    type="checkbox"
                    id={friend._id}
                    label={`${friend.name} (${friend.email})`}
                    disabled={!!groupId}
                    checked={splitWith.includes(friend._id)}
                    onChange={() => handleToggleFriend(friend._id)}
                  />
                ))}
            </div>
            <Form.Text muted>Select friends to split with</Form.Text>

            <Form.Text muted>Select multiple friends (Ctrl+Click)</Form.Text>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>Or Select Group</Form.Label>
            <Form.Select
              value={groupId}
              onChange={(e) => {
                setGroupId(e.target.value);
                setSplitWith([]);
              }}
              disabled={splitWith.length > 0}
            >
              <option value="">-- None --</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Who Paid?</Form.Label>
        <Form.Select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
          {getPayerOptions().map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <div className="d-flex justify-content-between">
        {showAddFriendsButton && showMakeGroupButton ? (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="add-exxpense-tooltip">
                Add a friend or make a group first
              </Tooltip>
            }
          >
            <span
              className="d-inline-block"
              style={{ pointerEvents: "none", cursor: "not-allowed" }}
            >
              <Button type="submit" variant="primary">
                Add Expense
              </Button>
            </span>
          </OverlayTrigger>
        ) : (
          <Button type="submit" variant="primary">
            Add Expense
          </Button>
        )}

        {showAddFriendsButton && (
          <Button
            type="submit"
            variant="primary"
            onClick={(e) =>{ e.preventDefault() ; navigate("/friends")}}
          >
            Add Friends
          </Button>
        )}

        {showMakeGroupButton && (
          <Button
            type="submit"
            variant="primary"
            onClick={(e) => {e.preventDefault(); navigate("/groups")}}
          >
            Make Group
          </Button>
        )}
      </div>
    </Form>
  );
};

export default AddExpenseForm;
