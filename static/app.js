async function editMemo(event) {
    const id = event.target.dataset.id;
    const editInput = prompt("수정할 값을 입력하세요.");
    const res = await fetch(`/memos/${id}`, {
        method: "PUT",
        headers: {
            "content-Type": "application/json",
        },
        body: JSON.stringify({
            id, // = id:id
            content: editInput,
        }),
    });
    readMemo();
}

/* 불러온 메모들을 HTML에 추가 */
function displayMemo(memo) {
    const ul = document.querySelector("#memo-ul");
    
    const li = document.createElement("li");
    // li.innerText = `[id:${memo.id}] ${memo.content}`;
    li.innerText = `${memo.content}`;

    const editBtn = document.createElement("button");
    editBtn.innerText = "수정하기";
    editBtn.addEventListener("click", editMemo)
    editBtn.dataset.id = memo.id;

    const delBtn = document.createElement("button");
    delBtn.innerText = "삭제";
    delBtn.addEventListener("click", deleteMemo);
    delBtn.dataset.id = memo.id;

    li.appendChild(editBtn);
    li.appendChild(delBtn);
    ul.appendChild(li);
};

async function readMemo() {
    // get 요청
    const res = await fetch('/memos'); 
    // jsonRes = [{id:123, content:'블라블라'}]
    const jsonRes = await res.json();
    const ul = document.querySelector("#memo-ul");
    ul.innerHTML = "";
    jsonRes.forEach(displayMemo);
};

/* 메모 생성(서버에 메모 만들어달라고 요청해야함) */
async function createMemo(value) {
    // post 요청 (간단한 get 요청에 비해 쓸게 많음)
    const res = await fetch("/memos", {
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        body: JSON.stringify({
            id: new Date().getTime(),
            content: value,
        }),
    });
    readMemo();
};

/* 메모 삭제 */
async function deleteMemo(event) {
    const id = event.target.dataset.id;
    const res = await fetch(`/memos/${id}`, {
        method: "DELETE",
    });
    readMemo();
};

/* Submit 이벤트 콜백함수 */
function handleSubmit(event) {
    // 새로고침 방지
    event.preventDefault();

    // input에 입력되는 값 가져오기
    const input = document.querySelector("#memo-input");
    createMemo(input.value)
    input.value = "";
};

const form = document.querySelector('#memo-form')
// form이 제출되었을 때 발생하는 이벤트
form.addEventListener("submit", handleSubmit)

readMemo(); // 서버에 있는 memos를 가져와서 ul에 업데이트함
