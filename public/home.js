// window.alert("Hello\nAshish")


// some imp regex ---->
const nameReg = (/^[a-zA-Z]+([\s][a-zA-Z]+)*$/);
const emailReg = (/^([a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,6})*$/);
const mobileReg = (/^(\+\d{1,3}[- ]?)?\d{10}$/);


// // // Network Status ---------->
let network = navigator.onLine
// console.log(network)
// if(network == false){
//     alert("Please connect with network.\nBecause network connection needed to DB call.  ")
// }







// // // <======================================<<<<< Regestation submit >>>>>>>>>>=====================================================>

// // // 1. On submit btn click --->
let reg_submit = document.getElementById("reg_submit")
reg_submit.addEventListener("click", reg_submit_func)

// // // 2. On Press Enter key --->
let EnterOnInternSubmit = document.getElementById("clg_name")
EnterOnInternSubmit.onkeydown = function (e) {
    if (e.keyCode == 13) {
        reg_submit_func()
    }
};

// // // Main func --->
async function reg_submit_func() {

    if (network == false) {
        alertBoxValue = 1
        return showAlertBox("Please connect with network.\nBecause network connection needed for DB call.", false)
    }

    let full_name = document.getElementById("Full_name").value.trim()
    let email = document.getElementById("email").value.trim()
    let mobile = document.getElementById("mobile").value.trim()
    let clg_name = document.getElementById("clg_name").value.toLowerCase().trim()


    // window.alert(`${full_name}\n${email}\n${mobile}\n${clg_name}`)

    if (!(full_name && email && mobile && clg_name)) {
        alertBoxValue = 1
        return window.showAlertBox("All field are Mandatory.\nPlease give appropriate data.", false)
    } else {

        if (!nameReg.test(full_name) && !full_name != "") {
            alertBoxValue = 1
            return showAlertBox(`${full_name} , Name is Invalid`, false)
        }

        if (!emailReg.test(email) && email != "") {
            alertBoxValue = 1
            return showAlertBox(`${email} , Email id is Invalid`, false)
        }

        if (!mobileReg.test(mobile) && mobile != "") {
            alertBoxValue = 1
            return showAlertBox(`${mobile} , Mobile No. is Invalid`, false)
        }
    }



    // let body = {
    //     name: some
    // }

    let body = {
        name: full_name,
        mobile: mobile,
        email: email,
        collegeName: clg_name
    }

    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
    let data = await fetch("/interns", option)
    // console.log(data)

    // console.log(await data.json())
    let a = await data.json()

    if (a.status == false) {
        alertBoxValue = 1
        return showAlertBox(`Error :- ${a.message}`, false)
    }

    // console.log(a)

    if (a.status == true) {

        // // // Data put for show successfull regestation -->

        let outPutEleForIntern = document.getElementById("intern_output")

        outPutEleForIntern.innerHTML = `<h3>Name : ${a.data.name}</h3>\n<h3>Email : ${a.data.email}</h3>\n<h3>Mobile : ${a.data.mobile}</h3>\n<h3>College Name : ${clg_name}</h3>`

        window.scrollTo({ top : outPutEleForIntern.offsetTop - 150 })

        // // Set data to empty --->
        document.getElementById("regesterForm").reset()

        alertBoxValue = 1
        return showAlertBox(`Successfull :- ${a.message}` , true , "Intern Created" )
    }


}










// // // <==========================================<<<<< Search Clg by short name >>>>>>===================================================>

// // // 1. On submit btn click --->
let searchClg = document.getElementById("clg_name_submit")
searchClg.addEventListener("click", searchClgName)

// // // 2. On Press Enter key --->
let EnterOnSearch = document.getElementById("clg_name_search")
EnterOnSearch.onkeydown = function (e) {
    if (e.keyCode == 13) {
        searchClgName()
    }
};

const clgNameRegex = /^([a-z]{2,})*$/


// // // // Main function here ----->
async function searchClgName() {

    if (network == false) {
        alertBoxValue = 1
        return showAlertBox("Please connect with network.\nBecause network connection needed for DB call.", false)
    }

    // // // Below el for progress when data load.( We will change visibility of progress when needed)
    let progress = document.getElementById("progress")
    progress.style.width = "0px"
    progress.style.visibility = "visible"


    // // // Input value of form -->

    let clg_name_search = document.getElementById("clg_name_search").value.toLowerCase().trim()

    if(!clg_name_search){{
        progress.style.visibility = "hidden"

        alertBoxValue = 1
        return showAlertBox(`Error : Give College Name (short form) for search.`, false)
    }}

    if (!clgNameRegex.test(clg_name_search)) {
        progress.style.visibility = "hidden"

        alertBoxValue = 1
        return showAlertBox(`Error : Given (${clg_name_search}) college name is not valid.`, false)
    }

    // // // Fetch call ---->

    let option = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let data = await fetch(`/collegeDetails?collegeName=${clg_name_search}`, option)

    // console.log(data)

    // console.log(await data.json())
    let a = await data.json()


    // // // Data to frontEnd 
    // console.log(a)
    // console.log(a.data)

    if (a.status == false) {
        // // // In any err we not want progress bar
        progress.style.visibility = "hidden"

        alertBoxValue = 1
        return showAlertBox(`Error :- ${a.message}`, false)

    } else {

        document.getElementById("clg_name_search").innerText = ""

        document.getElementById("fullName").innerHTML = "Full Name :- " + a.data.fullName
        document.getElementById("name").innerHTML = "Short Name :- " + a.data.name

        let internEL = document.getElementById("all_Interns")

        let divHtml = ""

        if (a.data.interns.length != 0) {
            for (let i = 0; i < a.data.interns.length; i++) {
                divHtml += `<h3 class="use_in_search_result" >(Sr :- ${i + 1} , Name :- ${a.data.interns[i].name} , Email Id :- ${addStarInBtw(a.data.interns[i].email)} , Phone No. :- ${addStarInBtw(a.data.interns[i].mobile)})</h3><br>`
            }
        } else {
            divHtml = `<h1 class="use_in_search_result" > No Interns are applied for this college (${a.data.name}).</h1>`
        }

        // // set data to div --->
        internEL.innerHTML = divHtml

        // // // Play success audio ---------> (Not showing alert box that's why need to play)
        let audio = new Audio("./sound/done.mp3")
        audio.play()

        // // // When data loaded successfully then we not want progess bar
        progress.style.visibility = "hidden"

    }

}










// // // <=========================================<<<< Create Clg Submit >>>>>==========================================================>

// // // 1. On submit btn click --->
let createClg = document.getElementById("create_clg_btn")
createClg.addEventListener("click", createNewClg)

// // // 2. On Press Enter key --->
let EnterOnCreateClg = document.getElementById("create_clg_btn")
EnterOnCreateClg.onkeydown = function (e) {
    if (e.keyCode == 13) {
        createNewClg()
    }
};


// // // Imp regex here ----->
const clgFullNmaeRegex = /^([a-zA-Z \_\.\-\,]{5,})*$/

// // // Main function ------>
async function createNewClg() {
    if (network == false) {
        alertBoxValue = 1
        return showAlertBox("Please connect with network.\nBecause network connection needed for DB call.", false)
    }


    let clg_shortname_create = document.getElementById("clg_short_name").value.toLowerCase().trim()


    let clg_fullname_create = document.getElementById("clg_Full_name").value.trim()

    if(!clg_shortname_create){
        alertBoxValue = 1
        return showAlertBox(`Error : Please give short name of college.`, false)
    }

    if (!clgNameRegex.test(clg_shortname_create)) {
        alertBoxValue = 1
        return showAlertBox(`Error : Given college Shortname (${clg_shortname_create}) is not valid.`, false)
    }

    if(!clg_fullname_create){
        alertBoxValue = 1
        return showAlertBox(`Error : Please give Full name of college.`, false)
    }


    if (!clgFullNmaeRegex.test(clg_fullname_create)) {
        alertBoxValue = 1
        return showAlertBox(`Error : Given college Fulltname (${clg_fullname_create}) is not valid.`, false)
    }

    let body = {
        name: clg_shortname_create,
        fullName: clg_fullname_create
    }

    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }

    let data = await fetch("/colleges", option)

    let a = await data.json()

    if (a.status == false) {
        alertBoxValue = 1
        return showAlertBox(`Error :- ${a.message}`, false)
    }

    if (a.status == true) {
        // // // Data put for show successfull creation -->

        let outPutEleForClg = document.getElementById("right_clg_created")

        outPutEleForClg.innerHTML = `<h1>College Details (created) Are :- </h1>\n
        <h2>Short Name : ${a.data.name}</h2>\n
        <h3>Full Name : ${a.data.fullName}</h3>\n
        <h2>Id : ${a.data._id}</h2>\n`


        window.scrollTo({ top : document.getElementById("create_clg").offsetTop - 150 })
        
        // // // Set value to normal ---->
        document.getElementById("createClgForm").reset()

        alertBoxValue = 1
        return showAlertBox(`Successfull :- ${a.message} `, true , "College Created!")
    }

}









// // // <==========================================<<<< Post Feedback >>>>>========================================================>


let feed_submit = document.getElementById("feed_submit_btn")
feed_submit.addEventListener("click", feed_submit_func)

// // // Main func --->
async function feed_submit_func() {

    if (network == false) {
        alertBoxValue = 1
        return showAlertBox("Please connect with network.\nBecause network connection needed for DB call.", false)
    }

    let progress = document.getElementById("progress_feed")
    progress.style.width = "0px"
    progress.style.visibility = "visible"

    let feedName = document.getElementById("feed_name").value.trim()

    let feedMsg = document.getElementById("feed_msg").value.trim()


    let checkedRadio = ""
    let radio = document.getElementsByName("feed_type")
    for (let i of radio) {
        if (i.checked) {
            checkedRadio = i.value
        }
    }

    if (!feedName) {
        feedName = "Guest"
    }

    if (!feedMsg) {
        progress.style.visibility = "hidden"
        
        alertBoxValue = 1
        return showAlertBox("Feedback message should be given.", false)
    }


    let body = {
        feedbackName: feedName,
        feedbackType: checkedRadio,
        feedbackMsg: feedMsg
    }


    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }

    let data = await fetch("https://feedback-hzwx.onrender.com/newFeedback/intern", option)

    let a = await data.json()

    if (a.status == false) {
        progress.style.display = "hidden"

        alertBoxValue = 1
        return showAlertBox(`Error :- ${a.message}`, false)
    }

    if (a.status == true) {
        // // // Form reset and process hide
        progress.style.visibility = "hidden"
        document.getElementById("feed_form").reset()

        // // // Showing div that contan all feeds ----------->
        let allFeedMainDiv = document.querySelector(".show_All_FeedBack_main")
        allFeedMainDiv.style.display = "flex"

        // // // Scroll to hidden div ---->
        window.scrollTo({ top : allFeedMainDiv.offsetTop - 50})

        // // // Set localstorage for ferture ----------------->
        localStorage.setItem("FeedBackForAk" , "1")

        // // // set value 0 to alReady all feeds fetched --->
        alReadyFeedShown = 0

        alertBoxValue = 1
        return showAlertBox(`Successfull :- ${a.message} `, true, "Feedback Submited")
    }


}










// // // // <=========================================<<<<< Show all feedback func >>>>===================================================>

// // // Below is for checking previously submited feedback or not ----->
let periviousFeedBack = localStorage.getItem("FeedBackForAk")
// console.log(periviousFeedBack)
if(periviousFeedBack){
    document.querySelector(".show_All_FeedBack_main").style.display = "flex"
}


// // // All ready fetched feedbacks?? ---->

let alReadyFeedShown = 0

// // // Main func --->
async function showAllFeedBack(){

    if (network == false) {
        alertBoxValue = 1
        return showAlertBox("Please connect with network.\nBecause network connection needed for DB call.", false)
    }

    if(alReadyFeedShown == 1){
        alertBoxValue = 1
        return showAlertBox("Feedbacks are already fetched , please scroll to bottom or refresh the window.", false , "Wrong request")
    }


    let prrocessAllFeed = document.getElementById("process_all_feeds")
    prrocessAllFeed.style.visibility = "visible"
    // prrocessAllFeed.style.display = "block";


    let data = await fetch("https://feedback-hzwx.onrender.com/getFeedback/intern")

    let a = await data.json()


    if (a.status == false) {
        progress.style.display = "hidden"

        alertBoxValue = 1
        return showAlertBox(`Error :- ${a.message}`, false)
    }


    if (a.status == true) {
        // // // Process hide and already shown value ---->
        prrocessAllFeed.style.visibility = "hidden"
        alReadyFeedShown = 1
        
        // // // Temp var to store all feeds from DB -->
        let temp = ""

        for(let i=0 ; i<a.data.length ; i++){
            temp += `  
            <div class="user_feeds_are">
                <h3>Name :- ${a.data[i].feedbackName}</h3>
                <p>Type :- ${a.data[i].feedbackType }</p>
                <p>Count :- ${a.data.length-i} </p>
                <p>Message:- ${a.data[i].feedbackMsg}</p>
                <p>Reply:- ${a.data[i].reply || "Thank You!"}</p>
                <p>Time:- ${a.data[i].whenCreated}</p>
            </div> `
        }
    
        // // // setting inner html to outPut div
        let mainDivOfAllFeeds = document.getElementById("all_feedback")
        mainDivOfAllFeeds.innerHTML = temp

        // // // After successfull fetched data scrolling window till div --->
        window.scrollTo({ top : mainDivOfAllFeeds.offsetTop - 50})

        alertBoxValue = 1
        return showAlertBox(`Successfull :- ${a.message} `, true, "All Feedback fetched")
    }

}










// // // <==================================<<<<<<<< Scroll to top >>>>==========================================================>

document.addEventListener("scroll", scrollProg)
// This is listing scoll even and giving self function attached with scroll.

const scrollDemoElement = document.querySelector("#progress_top")      // Element that is going to increase width.

// This is for all progress bar whit scroll down
function scrollProg() {
    // console.log("HI")

    // Total height of our web page.
    const totalHeigthWebPage = document.body.scrollHeight;

    // Scoll distance from top.
    const currentDistanceFromTop = document.documentElement.scrollTop;

    // This means srollBar height 
    const windowHeight = document.documentElement.clientHeight;

    // console.log(totalHeigthWebPage)
    // console.log(currentDistanceFromTop)
    // console.log(windowHeight)

    // Simply calculating percent of scrolled from top(very simply way).
    const scrollPercentage = (currentDistanceFromTop / (totalHeigthWebPage - windowHeight)) * 100


    // console.log(scrollPercentage)

    // Top scroll btn hide or show start from here.
    // Here i am going to show top btn on the percent of scroll

    // // // Go to top show after scroll atleast 20 
    if (scrollPercentage < 15) {
        document.getElementById("top_scroll_btn").style.visibility = "hidden"
    } else {
        document.getElementById("top_scroll_btn").style.visibility = "visible"
    }


    // // // This use to show progess bar and at 0-3% hide space.
    if (scrollPercentage > 3) {
        document.getElementById("progress_top").style.display = "block"
    } else {
        document.getElementById("progress_top").style.display = "none"
    }

    // console.log(Math.round(scrollPercentage)) 
    // Fatching width with our progress bar width.

    scrollDemoElement.style.width = Math.round(scrollPercentage) + "%"

}












// // // ==================================<<<<<<< Some Imp parts like alertbox and sound >>>>>>=========================================>


// // //=======================================<<< Alert box cancel >>>>==========================================>>>

// // // Vlaue 0 for logic to off alert box -->
var alertBoxValue = 0

// // // This is for click and off alert box on header --->
let cancelEl = document.getElementById("cancel")
cancelEl.addEventListener("click", cancelFunc)

function cancelFunc() {
    let alertBox = document.querySelector(".error_altert")
    alertBoxValue = 0
    alertBox.style.visibility = "hidden"
}



function showAlertBox(alertMsg ="No Page found", sound = false, alertName= "Error") {

    // let right = new Audio("sound/done.mp3")
    // let wrong = new Audio("sound/error.mp3")

    if (sound == true) {
        // let audio = new Audio("sound/done.mp3")
        // audio.play()

        new Audio("sound/done.mp3").play()
    } else {
        // let audio = new Audio("sound/error.mp3")
        // audio.play()
        
        new Audio("sound/error.mp3").play()
    }

    // let file = sound ? "sound/done.mp3" : "sound/error.mp3"
    // let audio = new Audio(file)
    // audio.play()

    document.querySelector(".error_altert").style.visibility = "visible"

    document.querySelector(".error_altert_content").innerHTML = `<h1>${alertName} ==> </h1>\n<h3>${alertMsg}</h3>`
    
}

// showAlertBox("Data" , "Successful" )

document.querySelector("body").onkeydown = (e) => {
    if ((e.keyCode == 88) && (alertBoxValue == 1)) {
        document.querySelector(".error_altert").style.visibility = "hidden"
        alertBoxValue == 0
    }
}



// // // <==============================================<<<<<< Clear form >>>>>>>=====================================================>

// // // Clg form clear -->
let clearClgDetails = ()=>{
    document.getElementById('createClgForm').reset() 
}

// // // Regs form clear -->
let clearRegsDetails = ()=>{
    document.getElementById('regesterForm').reset()
}

// // // feed form clear -->

function clearFeedDetails(){
    document.getElementById("feed_form").reset()
}




// // // <============================================<<<<<<< Make data sequre here >>>>>>>>===========================================>


// // // // Function to keep data sequre, data like Mobile no. or email
const dotComReg = (/(\.[a-z]{2,6})*$/)

// // // 1st fn for check email or not and call according (Call This fn for any str) ----->
function addStarInBtw(str) {
    let test = str.match(dotComReg)

    // console.log(test)
    // console.log(emailReg.test(str))  // // .test() giving true every times thatswhy go with .match()

    if (test[0] != "") {
        let callEmail = emailStarInBtw(str)
        var newstr = callEmail[0]
        var add = callEmail[1]
        let mainFn = makeSequreAny(newstr)
        return mainFn + add
    }
    else {
        return makeSequreAny(str)
    }

}

// // // 2nd fn to extrac email and domain name ----------->
function emailStarInBtw(str) {
    let test = str.match(dotComReg)
    let lastDmainName = test[0]
    let rem = str.indexOf(test[0])
    let main = str.split("").slice(0, rem).join("")
    return [main, lastDmainName]
}

// // // 3rd fn to make sequre any str ------------>
function makeSequreAny(str) {
    let len = str.length
    let half = Math.ceil(len / 2)
    let remainCount = len - half
    let halfRemain = Math.floor(remainCount / 2)
    let out = ""
    for (i in str) {
        if (i > halfRemain && (i < (len - halfRemain))) {
            out += "*"
            continue
        }
        out += str[i]
    }
    return out
}

