import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../styles/firebase'; 

const Home = () => {
  const [floorsStatus, setFloorsStatus] = useState<Record<string, { [key: string]: { status: string; buttonColor: string; category: string } }>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 画像のインデックスを管理
  const floors = ['6F','5F', '2F', '3F', '4F', '1F'];
  const images = ['/KOTEAlert.jpg','/cheifoon-main.jpg','/CRDS.png','/TechSeebo.jpeg'];
  const TextImage = ['/KOTEAlert_text.jpeg','/cheifoon_text.jpeg','/CRDS_text.jpeg','/TechSeebo_text.jpeg'];
  const NumberImage = ['/KOTEAlerta_number.jpeg','/cheifoon_number.jpeg','/CRDS_number.jpeg','/TechSeebo_number.jpeg']; 
  const intervalDuration = 5000; // 5秒ごとに画像を切り替える
  floors.sort((a, b) => {
    const numA = parseInt(a.slice(0, -1), 10);
    const numB = parseInt(b.slice(0, -1), 10);
    return numB - numA;
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const buildings = ['3号館'];

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

    // 画像の切り替え用のインターバル設定
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, intervalDuration);

    return () => clearInterval(intervalId); // コンポーネントがアンマウントされるときにインターバルをクリアする
  }, [images.length]); // images.length を依存リストに追加

  const clickHandler = (building: string, floor: string) => {
    router.push(`/detail?building=${building}&floor=${floor}`);
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

  // 画像を入れこむだけ
  function getStatus(status: string) {
    switch (status) {
      case '空き':
        return <img className='img-icon' src="/maru-removebg-preview.png" alt="空き" />;
      case '混雑':
        return <img className='img-icon' src="/batu-removebg-preview.png" alt="混雑" />;
      case 'やや混雑':
        return <img className='img-icon' src="/sankaku-removebg-preview.png" alt="やや混雑" />;
      default:
        return null;
    }
  }

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" />
      </Head>
      <img src='/logo_icon.png' alt="aaa" className="title-image" />
      {/* カラーボックスと説明を表示する部分 */}
      <div className="color-explanation">
         <p className='situation'>混雑状況</p>
        
        <div className="color-box">
          <div className="small-color-box small-color-box-no-use" />
        </div>
        <div className="color-explanation-item">利用停止</div>
        
        <div className="color-box">
          <div className="small-color-box small-color-box-crowded" />
        </div>
        <div className="color-explanation-item">混雑</div>
        
        <div className="color-box">
          <div className="small-color-box small-color-box-little-crowded" />
        </div>
        <div className="color-explanation-item">やや混雑</div>
        
        <div className="color-box">
          <div className="small-color-box small-color-box-empty" />
        </div>
        <div className="color-explanation-item">空き</div>
        
      </div>

      <div className="list-with-image">
        <div className="floor-table-container">
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
                            <span className="floor-text">{floor}</span>
                            <span className="status-icon">
                              {floorsStatus[building][floor]?.status &&
                                getStatus(floorsStatus[building][floor]?.status)}
                            </span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="image-container">
          <h1 className='floa-number'>6Fにて展示中!</h1>
          <div className="image-text">
            <div className="text-row">
              <img src={NumberImage[currentImageIndex]} alt="作品番号" className='work-number'/>
              <img src={TextImage[currentImageIndex]} alt="キャッチコピー" className='catch-copy'/>
            </div>
          </div>
          <div className="image-with-text">
            <img src={images[currentImageIndex]} alt="画像" className="floor-image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
