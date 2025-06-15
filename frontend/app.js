let contract;
let userAccount;

const CONTRACT_ADDRESS = ""; // <--- Add your contract address here

const ABI = [
  {
    "inputs": [{ "internalType": "bytes32", "name": "docHash", "type": "bytes32" }],
    "name": "getTimestamp",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function connectWallet() {
  if (window.ethereum) {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    userAccount = accounts[0];
    const web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    alert(" Connected: " + userAccount);
  } else {
    alert(" MetaMask not detected!");
  }
}

async function hashFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const buffer = new Uint8Array(reader.result);
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        resolve("0x" + hashHex);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

async function checkDocument() {
  const file = document.getElementById("fileInput").files[0];
  const resultDisplay = document.getElementById("result");
  const statusImage = document.getElementById("statusImage");

  if (!file || !contract) {
    alert("📄 Upload a file and connect wallet first.");
    return;
  }

  const fileHash = await hashFile(file);

  try {
    const result = await contract.methods.getTimestamp(fileHash).call();
    const timestamp = result[0];
    const submitter = result[1];

    if (timestamp > 0) {
      const date = new Date(timestamp * 1000);
      resultDisplay.innerText = ` Document Verified!\n Submitter: ${submitter}\n Time: ${date}`;

      statusImage.src = "shinchan.jpg";
      statusImage.style.display = "block";
      statusImage.classList.add("slide-in");


      // Store in localStorage
      let history = JSON.parse(localStorage.getItem("verificationHistory") || "[]");
      history.unshift({
      hash: fileHash,
      submitter: submitter,
      time: new Date(timestamp * 1000).toLocaleString()
      });
      localStorage.setItem("verificationHistory", JSON.stringify(history.slice(0, 5))); // keep last 5

      // Display history
      const historyList = document.getElementById("historyList");
      historyList.innerHTML = "";
      history.forEach(item => {
      const li = document.createElement("li");
      li.textContent = ` ${item.hash.slice(0, 10)}... • ${item.time} • ${item.submitter}`;
      historyList.appendChild(li);
      });

    } else {
      resultDisplay.innerHTML = " Document not found on blockchain.<br>I will strike you with my wand and make you noseless like Voldemort. Verify it soon!";

      statusImage.src = "harry.jpg";
      statusImage.style.display = "block";
      statusImage.classList.add("slide-in");
    }

    // Remove the animation class after animation ends to allow replay
    setTimeout(() => {
      statusImage.classList.remove("slide-in");
    }, 1000);
  } catch (err) {
    console.error(err);
    resultDisplay.innerText = " Error verifying document.";
  }
}
window.addEventListener("load", () => {
  const history = JSON.parse(localStorage.getItem("verificationHistory") || "[]");
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="hash"> ${item.hash}</div>
      <div class="details">
         ${item.time.split(",")[0]} -  ${item.time.split(",")[1]}
        <span> ${item.submitter}</span>
      </div>
    `;
    historyList.appendChild(li);
  });
});

function clearHistory() {
  localStorage.removeItem("verificationHistory");
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
}
