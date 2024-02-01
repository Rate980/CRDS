import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Firebase Admin SDKの初期化
cred = credentials.Certificate("crds-test-dc1be-firebase-adminsdk-1bekc-d978e3fc23.json")
firebase_admin.initialize_app(cred)

def read():
    # Firestoreのデータベースにアクセス
    db = firestore.client()

    # "statuses"コレクション内の全てのサブコレクションを取得
    statuses_ref = db.collection("statuses")
    collections = statuses_ref.list_documents()

    return collections

def update(building, floor, person: int):
    
    db = firestore.client()

    # コレクション、ドキュメントのパスを指定してデータを取得
    doc_ref = db.collection("statuses").document(building).collection("floors").document(floor)
    doc_ref.update({'people': person})

    # printData()

def printData():
    collections = read()

    # 全てのサブコレクションに対してループ
    for collection_ref in collections:
        # サブコレクション内の全てのドキュメントを取得
        docs = collection_ref.collection("floors").stream()

        # ドキュメントをループしてデータを表示
        for doc in docs:
            doc_data = doc.to_dict()
            print(f"{collection_ref.id}\t{doc.id} : {doc_data}")

def venue(building, floor):
    return building, floor

    collections = read()

    # 全てのサブコレクションに対してループ
    for collection_ref in collections:
        # サブコレクション内の全てのドキュメントを取得
        docs = collection_ref.collection("floors").stream()

        # ドキュメントをループして場所が存在するか確認
        for doc in docs:

            if collection_ref.id == building and doc.id == floor :
                return collection_ref.id, doc.id
            
    return None, None


if __name__ == "__main__":

    printData()
