import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { firestore } from '../styles/firebase.js';
import { collection,getDocs,DocumentSnapshot,getDoc,doc,setDoc,deleteDoc} from 'firebase/firestore';
import { get } from 'http';
import { set } from 'firebase/database';

const MasterFloor = () => {
  const router = useRouter();
  const statusOptions = ['混雑', '空き', 'やや混雑', '利用停止'];     // statusの選択肢
  const categoryOptions = ['IoT','Web','App','シス開'];                    // categoryの選択肢
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [floors, setFloors] = useState<string[]>([]);
  const [floorsStatus, setFloorsStatus] = useState<Record<string, string>>({});
  const [floorsCategory, setFloorsCategory] = useState<Record<string, string>>({});
  const [floorsPeople, setFloorsPeople] = useState<Record<string, number>>({});
  const [newFloorName, setNewFloorName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (router.query && router.query.building) {
        const buildingName = router.query.building.toString();
        setSelectedBuilding(buildingName);

        const floorsCollectionRef = collection(firestore, 'statuses', buildingName, 'floors');
        const floorsSnapshot = await getDocs(floorsCollectionRef);
        const fetchedFloors = floorsSnapshot.docs.map((doc) => doc.id);

        const statusPromises = fetchedFloors.map(async (floor) => {
          const floorDocRef = doc(floorsCollectionRef, floor);
          const docSnapshot: DocumentSnapshot = await getDoc(floorDocRef);
          const data = docSnapshot?.data();
          return { [floor]: data?.status || '未定義' };
        });

        const categoryPromises = fetchedFloors.map(async (floor) => {
          const floorDocRef = doc(floorsCollectionRef, floor);
          const docSnapshot: DocumentSnapshot = await getDoc(floorDocRef);
          const data = docSnapshot?.data();
          return { [floor]: data?.category || '未設定'};
        });

        const peoplePromises = fetchedFloors.map(async (floor) => {
          const floorDocRef = doc(floorsCollectionRef, floor);
          const docSnapshot: DocumentSnapshot = await getDoc(floorDocRef);
          const data = docSnapshot?.data();
          return { [floor]: data?.people || 0 }; // デフォルト値は0
        });

        const statuses = await Promise.all(statusPromises);
        const combinedStatuses = Object.assign({}, ...statuses);
        setFloorsStatus(combinedStatuses);

        const category = await Promise.all(categoryPromises);
        const combinedCategory = Object.assign({}, ...category);
        setFloorsCategory(combinedCategory);
        
        const peopleData = await Promise.all(peoplePromises);
        const combinedPeopleData = Object.assign({}, ...peopleData);
        setFloorsPeople(combinedPeopleData);

        setFloors(fetchedFloors);
      } else {
        console.error('Building is not selected');
      }
    };
    fetchData();
  }, [router.query.building]);

  const addBuildingFloor = async () => {
    try {
      const floorsCollectionRef = collection(firestore, 'statuses', selectedBuilding, 'floors');
      const floorDocRef = doc(floorsCollectionRef, newFloorName);
      await setDoc(floorDocRef, { status: '未定義' });

      // Update state after adding a new floor
      setFloors((prevFloors) => [...prevFloors, newFloorName]);
      setFloorsStatus((prevStatus) => ({ ...prevStatus, [newFloorName]: '未定義' }));

      // Clear the input field
      setNewFloorName('');
    } catch (error) {
      console.error('Error adding floor:', error);
    }
  };

  const deleteBuildingFloor = async (floor: string) => {
    try {
      const floorDocRef = doc(firestore, 'statuses', selectedBuilding, 'floors', floor);
      await deleteDoc(floorDocRef);

      // Update state after deleting a floor
      setFloors((prevFloors) => prevFloors.filter((f) => f !== floor));
      setFloorsStatus((prevStatus) => {
        const newStatus = { ...prevStatus };
        delete newStatus[floor];
        return newStatus;
      });
    } catch (error) {
      console.error('Error deleting floor:', error);
    }
  };

  const updateStatus = async (floor: string, newStatus: string) => {
    try {
      const floorDocRef = doc(firestore, 'statuses', selectedBuilding, 'floors', floor);
  
      // 現在のデータを取得
      const docSnapshot: DocumentSnapshot = await getDoc(floorDocRef);
      const existingData = docSnapshot?.data() || {};
  
      // ステータスを更新し、他のプロパティはそのまま保持
      await setDoc(floorDocRef, { ...existingData, status: newStatus });
  
      // Update state after modifying the status
      setFloorsStatus((prevStatus) => ({ ...prevStatus, [floor]: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };  

  const updateCategory = async (floor: string, newCategory: string) => {
    try {
      const floorDocRef = doc(firestore, 'statuses', selectedBuilding, 'floors', floor);
      const docSnapshot: DocumentSnapshot = await getDoc(floorDocRef);
      const existingData = docSnapshot?.data() || {};

      await setDoc(floorDocRef, { ...existingData, category: newCategory });

      setFloorsCategory((prevCategory) => ({ ...prevCategory, [floor]: newCategory }));
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };


  return (
    <div>
      <h1 className='main_title'>{selectedBuilding}のフロア状況</h1>
      <div className='add-button'>
        <input
          type='text'
          placeholder='新しいフロア名'
          value={newFloorName}
          onChange={(e) => setNewFloorName(e.target.value)}
        />
        <button onClick={addBuildingFloor}>フロアの追加</button>
      </div>
      <table className='master-edit-table'>
        <thead>
          <tr>
            <th>フロア</th>
            <th>人数</th>
            <th>ステータス</th>
            <th>カテゴリー</th>
            <th>アクション</th>
          </tr>
        </thead>
        <tbody >
          {floors.map((floor) => (
            <tr className='master-tr' key={floor}>
              <td>{floor}</td>
              <td>{floorsPeople[floor]}人</td>
              <td>
                <select value={floorsStatus[floor]}onChange={(e) => updateStatus(floor, e.target.value)}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select value={floorsCategory[floor]}onChange={(e) => updateCategory(floor, e.target.value)}>
                 {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                 ))}
                </select>
              </td>
              <td>
                <button onClick={() => deleteBuildingFloor(floor)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MasterFloor;
