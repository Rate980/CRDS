// index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../styles/firebase'; 

const Home = () => {
  const [floorsStatus, setFloorsStatus] = useState<Record<string, { [key: string]: { status: string; buttonColor: string; category: string } }>>({});
  const floors = ['6F','5F', '2F', '3F', '4F', '1F'];
  floors.sort((a, b) => {
    const numA = parseInt(a.slice(0, -1), 10);
    const numB = parseInt(b.slice(0, -1), 10);
    return numB - numA;
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const buildings = ['2号館'];

      const initialStatus: Record<string, { [key: string]: { status: string; buttonColor: string; category: string } }> = {};
      buildings.forEach((building) => {
        initialStatus[building] = {};
        floors.forEach((floor) => {
          initialStatus[building][floor] = { status: '', buttonColor: '', category: '' };
        });
      });
      setFloorsStatus(initialStatus);

      const unsubscribeCallbacks: (() => void)[] = [];

      buildings.forEach((building) => {
        floors.forEach((floor) => {
          const docRef = doc(firestore, 'statuses', building, 'floors', floor);
          const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              const statusData = {
                status: data?.status || '',
                buttonColor: getButtonColor(data?.status || ''),
                category: data?.category || '',
              };

              setFloorsStatus((prevStatus) => ({
                ...prevStatus,
                [building]: {
                  ...prevStatus[building],
                  [floor]: statusData,
                },
              }));
            }
          });
          unsubscribeCallbacks.push(unsubscribe);
        });
      });

      return () => {
        unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
      };
    };

    fetchData();
  }, []);

  const clickHandler = (building: string, floor: string) => {
    router.push(`/admin?building=${building}&floor=${floor}`);
  };

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

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" />
      </Head>
      <h1 className='main_title'>混雑状況</h1>
      <table className='floa-table'>
        <thead>
          <tr className='place-number'>
            {Object.keys(floorsStatus).map((building) => (
              <th key={building} className='floa-number'>{building}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {floors.map((floor) => (
            <tr key={floor}>
              {Object.keys(floorsStatus).map((building) => {
                const isStatusUndefined = floorsStatus[building][floor]?.status === '未定義';

                return (
                  <td key={building}>
                    {isStatusUndefined ? (
                      <div style={{ visibility: 'hidden' }} />
                    ) : (
                      <button
                        className={`monitor ${floorsStatus[building][floor]?.buttonColor || ''}`}
                        onClick={() => clickHandler(building, floor)}
                      >
                        {floor} 
                        ・
                        {floorsStatus[building][floor]?.category && (
                          <span className="category">{floorsStatus[building][floor]?.category}</span>
                        )}
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;
