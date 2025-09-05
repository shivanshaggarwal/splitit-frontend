import React from 'react'
import {clearGroupMessage,addGroupMember,createGroup,fetchGroups,removeGroupMember} from '../features/group/groupSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect,useState } from 'react'; 
import { Container,Alert,Form,Row,Col,Accordion,Table,Button,Spinner } from 'react-bootstrap';


const GroupsPage = () => {
  
  const {loading,error,message, groups} = useSelector((state)=>state.groups);
  const [groupName, setGroupName] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(fetchGroups());
},[dispatch]);


  const handleCreateGroup = (e) => {
    e.preventDefault();
    const members = memberEmails
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email !== '');

    dispatch(createGroup({ name: groupName,memberEmails: members }));
    setGroupName('');
    setMemberEmails('');
  };

  const handleRemoveMember = (groupId,userEmail)=>{
    dispatch(removeGroupMember({ groupId, userEmail }));
  }
  const handleAddMember = (groupId)=>{
    if (!newMemberEmail) return;
    dispatch(addGroupMember({ groupId, userEmail: newMemberEmail }));
    setNewMemberEmail('');
  }
  
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Group Management</h2>

      {message && (
        <Alert variant="success" onClose={() => dispatch(clearGroupMessage())} dismissible>
          {message}
        </Alert>
      )}
      {error && <Alert variant="danger" dismissible>{error}</Alert>}

      {/* Create Group Form */}
      <Form onSubmit={handleCreateGroup} className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </Col>
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Comma-separated member emails"
              value={memberEmails}
              onChange={(e) => setMemberEmails(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Create Group'}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Group List */}
      {groups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <Accordion defaultActiveKey="0">
          {groups.map((group, idx) => (
            <Accordion.Item eventKey={idx.toString()} key={group._id} className="mb-3">
              <Accordion.Header>{group.name}</Accordion.Header>
              <Accordion.Body>
                <h6>Group Members:</h6>
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.members.map((member) => (
                      <tr key={member._id}>
                        <td>{member.name}</td>
                        <td>{member.email}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveMember(group._id, member.email)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Form className="d-flex gap-2 mt-3">
                  <Form.Control
                    type="email"
                    placeholder="Add member email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                  />
                  <Button
                    variant="success"
                    onClick={() => handleAddMember(group._id)}
                    disabled={!newMemberEmail}
                  >
                    Add Member
                  </Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
}

export default GroupsPage