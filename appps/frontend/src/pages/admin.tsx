// admin.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { firestore } from '../styles/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Admin = () => {
  const [buttonStatus, setButtonStatus] = useState<string>('');
  const router = useRouter();

  // URLパラメータから建物と階を取得
  const { building, floor } = router.query;

  useEffect(() => {
    if (building && floor) {
      const fetchData = async () => {
        try {
          const docRef = doc(firestore, 'statuses', building.toString(), 'floors', floor.toString());
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setButtonStatus(docSnap.data().status);
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      };

      fetchData();
    }
  }, [router.query]);

  const updateStatus = async (newStatus: string) => {
    if (building && floor) {
      const docRef = doc(firestore, 'statuses', building.toString(), 'floors', floor.toString());
      await setDoc(docRef, { status: newStatus });
      setButtonStatus(newStatus);

      // ホームに戻る
      router.push('/');
    }
  };

  return (
    <div>
      <h1 className='main_title'>管理画面</h1>
      <table className='admin-table'>
        <tr>
          <td>
            <button className="admin-no-use" onClick={() => updateStatus('利用停止')}>
              利用停止
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button className="admin-crowded" onClick={() => updateStatus('混雑')}>
              混雑
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button className="admin-little-crowded" onClick={() => updateStatus('やや混雑')}>
              やや混雑
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button className="admin-empty" onClick={() => updateStatus('空き')}>
              空き
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button className='admin-AI-on'>ON</button>
            <button className='admin-AI-off'>OFF</button>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default Admin;
