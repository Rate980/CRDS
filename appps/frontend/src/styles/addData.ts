import { collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../styles/firebase';

const addSampleData = async () => {
  const building = 'building2';
  const floors = ['1F', '2F', '3F', '4F', '5F'];

  for (const floor of floors) {
    const floorCollection = collection(firestore, 'statuses', building, floor);

    // サンプルデータ（ステータスとボタンカラー）を追加
    await setDoc(doc(floorCollection), {
      status: '空き', // 初期ステータス
    });
  }

  console.log('Sample data added successfully!');
};

addSampleData();
