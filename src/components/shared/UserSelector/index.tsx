import React, { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { User } from "../../../types/database";
import { LoadingSpinner } from "../LoadingSpinner";
import { ErrorDisplay } from "../ErrorDisplay";
import styles from "./styles.module.css";

interface BaseUserSelectorProps {
  teamId?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

interface SingleUserSelectorProps extends BaseUserSelectorProps {
  multiple?: false;
  selectedUserId?: string | null;
  onChange: (userId: string | null) => void;
}

interface MultiUserSelectorProps extends BaseUserSelectorProps {
  multiple: true;
  selectedUserIds: string[];
  onMultiChange: (userIds: string[]) => void;
}

type UserSelectorProps = SingleUserSelectorProps | MultiUserSelectorProps;

export const UserSelector: React.FC<UserSelectorProps> = ({
  teamId,
  label = "Assign to",
  error,
  disabled,
  multiple,
  ...props
}) => {
  const supabase = useSupabaseClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        let query = supabase.from("users").select("*");

        if (teamId) {
          query = query.eq("team_id", teamId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setUsers(data as User[]);
      } catch (error) {
        console.error("Error loading users:", error);
        setLoadError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [supabase, teamId]);

  if (loading) {
    return <LoadingSpinner size="small" />;
  }

  if (loadError) {
    return (
      <ErrorDisplay
        error={{
          code: "USER_LOAD_ERROR",
          message: loadError,
          details: "Unable to load user list",
        }}
      />
    );
  }

  if (multiple && "selectedUserIds" in props && "onMultiChange" in props) {
    return (
      <div className={styles.container}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.userList}>
          {users.map((user) => (
            <label key={user.id} className={styles.userCheckbox}>
              <input
                type="checkbox"
                checked={props.selectedUserIds.includes(user.id)}
                onChange={(e) => {
                  const newSelection = e.target.checked
                    ? [...props.selectedUserIds, user.id]
                    : props.selectedUserIds.filter((id) => id !== user.id);
                  props.onMultiChange(newSelection);
                }}
                disabled={disabled}
              />
              <div className={styles.userInfo}>
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || ""}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {(user.full_name || user.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{user.full_name || user.email}</span>
              </div>
            </label>
          ))}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  // Single user selector
  if ("selectedUserId" in props && "onChange" in props) {
    return (
      <div className={styles.container}>
        {label && <label className={styles.label}>{label}</label>}
        <select
          value={props.selectedUserId || ""}
          onChange={(e) => props.onChange(e.target.value || null)}
          className={styles.select}
          disabled={disabled}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name || user.email}
            </option>
          ))}
        </select>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  return null;
};
