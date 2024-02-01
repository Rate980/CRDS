import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { firestore } from '../styles/firebase.js';
import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';


const Master = () => {
  const [newBuilding, setNewBuilding] = useState<string>('');
  const [buildings, setBuildings] = useState<string[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    const buildingsRef = collection(firestore, 'statuses');
    const buildingsSnapshot = await getDocs(buildingsRef);
    setBuildings(buildingsSnapshot.docs.map(doc => doc.id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addBuilding = async () => {
    if (newBuilding && !buildings.includes(newBuilding)) {
      const docRef = doc(firestore, 'statuses', newBuilding);
      await setDoc(docRef, { name: newBuilding });
      setNewBuilding('');
      setBuildings(prev => [...prev, newBuilding]);
    }
  };

  const deleteBuilding = async (building: string) => {
    const docRef = doc(firestore, 'statuses', building);
    await deleteDoc(docRef); // Firestoreからデータを削除
    setBuildings(prev => prev.filter(b => b !== building));
  };

  const goToAdmin = (building: string) => {
    router.push(`/master_floor?building=${building}`);
  };

  return (
    <div>
      <h1 className='main_title'>マスター管理画面</h1>
      <p className='master-table-number'>号館一覧</p>
      <div className='add-button'>
        <input
          type="text"
          id="newBuildingInput"
          value={newBuilding}
          onChange={(e) => setNewBuilding(e.target.value)}
          placeholder="新しい号館名"
        />
        <button className='add-building' onClick={addBuilding}>追加</button>
      </div>
      <table className='master-list'>
        {buildings.map((building) => (
          <tr className='master-table' key={building}>
            {building}
            <td>
              <button className='master-admin-button' onClick={() => goToAdmin(building)}>管理</button>
              <button className='master-delete-button' onClick={() => deleteBuilding(building)}>削除</button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Master;
