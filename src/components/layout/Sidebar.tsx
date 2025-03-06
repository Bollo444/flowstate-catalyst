import React from 'react';
import { FiHome, FiFile, FiBox, FiLayout, FiMessageSquare, FiBell, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>FlowState</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <FiHome className="icon" />
              <span className="label">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/flow">
              <FiFile className="icon" />
              <span className="label">Flow</span>
            </Link>
          </li>
          <li>
            <Link to="/tasks">
              <FiLayout className="icon" />
              <span className="label">Tasks</span>
            </Link>
          </li>
          <li>
            <Link to="/team">
              <FiBox className="icon" />
              <span className="label">Team</span>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <FiSettings className="icon" />
              <span className="label">Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/messages">
              <FiMessageSquare className="icon" />
              <span className="label">Messages</span>
            </Link>
          </li>
          <li>
            <Link to="/notifications">
              <FiBell className="icon" />
              <span className="label">Notifications</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
