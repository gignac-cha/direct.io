import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CSSProperties,
  ChangeEvent,
  Suspense,
  useCallback,
  useState,
} from 'react';
import { useDirectContext } from '../context';
import { DirectContextProvider } from '../provider';

const UserControl = ({ user }: { user: User }) => {
  const {
    mutations: { useEditUserMutation, useRemoveUserMutation },
  } = useDirectContext();

  const { mutateAsync: editUser } = useEditUserMutation(user.uuid);
  const { mutateAsync: removeUser } = useRemoveUserMutation(user.uuid);

  const random = (start?: number, end?: number) => {
    const randomValue = Math.random();
    if (start && end) {
      return Math.floor(start + randomValue * (end - start));
    } else if (start && !end) {
      end = start;
      return Math.floor(randomValue * end);
    } else if (!start && !end) {
      return randomValue;
    }
    return randomValue;
  };

  const editRandomly = (randomValue: number): [keyof User, string] | [] => {
    switch (randomValue) {
      case 0:
        return ['name', `test-${Date.now()}`];
      case 1:
        return ['nickname', `test-${Date.now()}`];
      case 2:
        return ['email', `test-${Date.now()}@test.com`];
      case 3:
        return [
          'birthday',
          `${new Date(`${random(1900, 2020)}-${random(12) + 1}-${random(28) + 1}`)}`,
        ];
    }
    return [];
  };

  return (
    <section
      style={{ display: 'flex', flexDirection: 'row', columnGap: '1rem' }}
    >
      <button
        onClick={async () => {
          const [name, value] = editRandomly(random(4));
          if (name && value) {
            user[name] = value;
            await editUser({ ...user });
          }
        }}
      >
        ✏️ Edit Randomly
      </button>{' '}
      <button onClick={() => removeUser()}>❌ Delete User</button>
    </section>
  );
};

const UserListItem = ({ user }: { user: User }) => {
  const style: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    columnGap: '1rem',
  };

  return (
    <li title={user.uuid}>
      <section style={style}>
        <b>Nickname</b>
        <span>{user.nickname}</span>
      </section>
      <section style={style}>
        <b>Name</b>
        <span>{user.name}</span>
      </section>
      <section style={style}>
        <b>Email</b>
        <address>{user.email}</address>
      </section>
      <section style={style}>
        <b>Birthday</b>
        <time dateTime={user.birthday}>
          {new Date(user.birthday).toLocaleDateString()}
        </time>
      </section>
      <UserControl user={user} />
    </li>
  );
};

const UserList = () => {
  const {
    suspenseQueries: { useUserListSuspenseQuery },
  } = useDirectContext();

  const { data: users } = useUserListSuspenseQuery();

  return (
    <section>
      <h2>Users ({users.length})</h2>
      <ul style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        {users.map((user: User) => (
          <UserListItem key={user.uuid} user={user} />
        ))}
      </ul>
    </section>
  );
};

const AddUser = () => {
  const {
    mutations: { useAddUserMutation },
  } = useDirectContext();

  const { mutateAsync: addUser } = useAddUserMutation();

  const [newUser, setNewUser] = useState<Partial<NewUser>>({});

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.currentTarget;
      setNewUser({ ...newUser, [name]: value.trim() });
    },
    [newUser],
  );

  const onClick = useCallback(async () => {
    const { name, nickname, email, birthday } = newUser;
    if (name && nickname && email && birthday) {
      await addUser({ name, nickname, email, birthday });
      setNewUser({});
    }
  }, [addUser, newUser]);

  const styles: { container: CSSProperties; row: CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      rowGap: '1rem',
      padding: '1rem',
      backgroundColor: 'rgba(0, 0, 0, .1)',
      borderRadius: 4,
    },
    row: { display: 'grid', gridTemplateColumns: '1fr 2fr' },
  };

  return (
    <section style={styles.container}>
      <h3>Add User</h3>
      <label style={styles.row}>
        <small>Name</small>
        <input name="name" onChange={onChange} />
      </label>
      <label style={styles.row}>
        <small>Nickname</small>
        <input name="nickname" onChange={onChange} />
      </label>
      <label style={styles.row}>
        <small>Email</small>
        <input name="email" onChange={onChange} />
      </label>
      <label style={styles.row}>
        <small>Birthday</small>
        <input name="birthday" type="date" onChange={onChange} />
      </label>
      <button
        onClick={onClick}
        disabled={
          !newUser.name ||
          !newUser.nickname ||
          !newUser.email ||
          !newUser.birthday
        }
      >
        ✚ Add User
      </button>
    </section>
  );
};

const Index = () => {
  return (
    <Suspense fallback={'Loading...'}>
      <section
        style={{
          display: 'flex',
          flexDirection: 'row',
          columnGap: '1rem',
        }}
      >
        <UserList />
        <AddUser />
      </section>
    </Suspense>
  );
};

const client = new QueryClient();

export const Root = () => {
  return (
    <QueryClientProvider client={client}>
      <DirectContextProvider>
        <header></header>
        <nav></nav>
        <main style={{ padding: '1rem' }}>
          <Index />
        </main>
        <footer></footer>
      </DirectContextProvider>
    </QueryClientProvider>
  );
};
