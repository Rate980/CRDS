// index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../styles/firebase';

const Home = () => {
  // 各フロアの状態を管理するstate
  const [floorsStatus, setFloorsStatus] = useState<Record<string, { status: string; buttonColor: string }>>({});

  const router = useRouter();

  useEffect(() => {
    // Firestoreから各フロアの状態を取得する関数
    const fetchData = async () => {
      // 各フロアのリスト。新しいフロアはこちらに追加する。
      const floors = ['5F', '2F', '3F', '4F', '1F'];
      // フロア番号の降順でソートします。
      floors.sort((a, b) => {
        const numA = parseInt(a.slice(0, -1), 10);
        const numB = parseInt(b.slice(0, -1), 10);
        return numB - numA;
      });

      // フロアごとの状態を格納するオブジェクト
      const floorStatus: Record<string, { status: string; buttonColor: string }> = {};

      // 各フロアの状態をFirestoreから取得します。
      await Promise.all(
        floors.map(async (floor) => {
          const docRef = doc(firestore, 'statuses', floor);
          // Firestoreのデータの変更をリッスンします。
          const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              // データをstateに更新します。
              floorStatus[floor] = {
                status: data?.status || '',
                buttonColor: getButtonColor(data?.status || ''),
              };
              setFloorsStatus({ ...floorStatus });
            }
          });

          return unsubscribe;
        })
      );

      // 状態をフロア番号の昇順でソート
      const sortedFloorsStatus = Object.entries(floorStatus)
        .sort((a, b) => a[1].status.localeCompare(b[1].status))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, { status: string; buttonColor: string }>);

      setFloorsStatus(sortedFloorsStatus);
    };

    fetchData();
  }, []);

  // フロアをクリックしたときのハンドラー
  const clickHandler = (floor: string) => {
    router.push(`/admin?floor=${floor}`);
  };

  // ボタンの色をステータスに基づいて返す関数
  const getButtonColor = (status: string) => {
    switch (status) {
      case '利用停止':
        return 'monitor-no-use';
      case '混雑':
        return 'monitor-crowded';
      case 'やや混雑':
        return 'monitor-little-crowded';
      case '空き':
        return 'monitor-empty';
      default:
        return '';
    }
  };

  // コンポーネントのレンダリング
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
        />
      </Head>
      <h1 className='main_title'>混雑状況</h1>
      <table className='admin-table'>
        <th className='floa-number'>
            1号館
        </th>
        <tr>
          <td>
            <button className="admin-no-use" >
              5F・Web
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button className="test-1">
              4F・IoT
            </button>
            <button className='test-2'>
              4F・Web
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button className="admin-little-crowded" >
              3F・App
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button className="admin-empty" >
              2F・App
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button className="admin-little-crowded" >
              1F・Web 
            </button>
          </td>
        </tr>
      </table>
    </>
  );
};

export default Home;