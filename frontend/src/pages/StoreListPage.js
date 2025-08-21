import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StoreListPage() {
  const [stores, setStores] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await axios.get('/api/stores');
      setStores(res.data);
    })();
  }, []);
  return (
    <table>
      <thead>
        <tr><th>Name</th><th>Address</th><th>Rating</th></tr>
      </thead>
      <tbody>
        {stores.map(store =>
          <tr key={store.id}>
            <td>{store.name}</td>
            <td>{store.address}</td>
            <td>{store.rating}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
