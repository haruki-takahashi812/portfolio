// #region | background zoom in and out on scroll

let bg = document.querySelector(".bg")

function bgZoom() {
	let scroll = window.pageYOffset
	bg.style.width = `${112 - scroll / 310}vw`
	bg.style.height = `${112 - scroll / 310}vh`
	bg.style.marginLeft = `-${(112 - scroll / 310) / 2}vw`
	bg.style.marginTop = `-${(112 - scroll / 310) / 2}vh`
}

// #endregion
// #region | side-nav page indicators

const sections = document.querySelectorAll(".sec")
const sidenav = document.querySelector(".sidenav")

function updatePageIndicators() {
	const link = document.querySelectorAll(".dot")
	const top = window.pageYOffset

	sections.forEach((each) => {
		let id = each.getAttribute("id")
		let height = each.clientHeight
		let offset = each.getBoundingClientRect().top + window.scrollY - height + 150;

		if (top >= offset && top < offset + height) {
			link.forEach((e) => e.classList.remove("active"))
			const finder = document.querySelector(`[data-scroll="${id}"]`)
			finder.classList.add("active")
		}
	});
}

updatePageIndicators()

// #endregion
// #region | scroll to top arrow

const scrollArrow = document.querySelector(".scroll-arrow")

scrollArrow.addEventListener("click", () => {
	window.scrollTo(0, 0)
})

function showScrollTopArrow() {
	let current = window.innerHeight + window.scrollY
	let bottom = document.body.scrollHeight

	if (bottom - current < 650) {
		scrollArrow.classList.add("show")
	} else {
		scrollArrow.classList.remove("show")
	}
}

// #endregion

window.addEventListener("scroll", () => {
	bgZoom()
	updatePageIndicators()
	showScrollTopArrow()
})

// #region | sections and bouncing letters

function createTitle(text, element) {
	text = text.replaceAll(" ", "+").replaceAll("\n", "~")
	// + for space and ~ for new line

	const textArr = text.split("");

	for (let i = 0; i < textArr.length; i++) {
		setTimeout(() => {
			const letter = document.createElement("h1");

			if (textArr[i] === "+") {
				letter.innerText = "\xa0"
				element.append(letter)
			} else if (textArr[i] === "~") {
				const br = document.createElement("br")
				element.append(br)
			} else {
				letter.innerText = textArr[i];

				element.append(letter);

				letter.classList.add("bounceIn");

				setTimeout(() => {
					letter.classList.remove("bounceIn");
				}, 800)

				letter.addEventListener("mouseenter", () => {
					if (letter.classList.contains("animationRunning")) {
						return
					}
					letter.classList.add("animationRunning");
					letter.classList.add("rubberband");

					setTimeout(() => {
						letter.classList.remove("rubberband");
						letter.classList.remove("animationRunning");
					}, 600);
				});
			}
		}, i * 60);
	}
}

const homeTitle = document.querySelector(".home-title")
const homeDownloadResumeBtn = document.querySelector(".download-resume-btn")

setTimeout(() => {
	createTitle("Hi,\nI'm Haruki Takahashi,\nFull Stack Developer", homeTitle)
	setTimeout(() => {
		homeDownloadResumeBtn.classList.add("observer-animation")
	}, 1000);
}, 1000);


const ioTargets = document.querySelectorAll(".section-title");

ioTargets.forEach(target => {
	const io = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const el = entry.target
				createTitle(entry.target.getAttribute("data-text"), entry.target)
				observer.disconnect()
			}
		})
	}, { threshold: 1 })
	io.observe(target, { rootMargin: "100px" })
})


const contactFormElements = document.querySelectorAll("form input, form textarea, form button")

contactFormElements.forEach(target => {
	const io = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const el = entry.target
				el.classList.add("observer-animation")
				observer.disconnect()
			}
		})
	})
	io.observe(target, { rootMargin: "-100px" })
})

let timeout = false
const nameInput = document.querySelector("#name-input")
const emailInput = document.querySelector("#email-input")
const messageInput = document.querySelector("#message-input")
const formInfo = document.querySelector(".form-info")

messageInput.addEventListener("input", () => {
	messageInput.classList.remove("error")
	formInfo.classList.remove("success")
	formInfo.innerText = ""
})

function sendMail() {
	if (timeout) {
		formInfo.classList.remove("success")
		formInfo.innerText = "You must wait 1 minute before your next request."
		return
	}

	let tempParams = {
		name: nameInput.value,
		email: emailInput.value,
		message: messageInput.value
	}

	emailjs.send("service_0mdrl8s", "template_2f97bv3", tempParams).then(res => console.log("Success " + res.status))

	formInfo.classList.add("success")
	formInfo.innerText = "Message sent succesfully!"

	timeout = true
	setTimeout(() => {
		timeout = false
	}, 60000);
}

function validateInputs(event) {
	event.preventDefault();

	if (!messageInput.value.trim()) {
		messageInput.classList.add("error")
		formInfo.classList.remove("success")
		formInfo.innerText = "Fill in the required fields."
	} else {
		messageInput.classList.remove("error")
		sendMail()
	}
}
document.querySelector("form").addEventListener("submit", validateInputs)

// #endregion
// #region | Vanilla Tilt Cards

VanillaTilt.init(document.querySelectorAll(".card"), {
	glare: true,
	// reverse: true,
	"max-glare": 0.1,
	speed: 1000,
})

// #endregion
// #region | cards carousel slider

let splide = new Splide('.splide', {
	// type: 'loop',
	drag: 'free',
	perPage: 3,
	perMove: 1,
	rewind: true,
	focus: 'center',
	pagination: true,
	width: `${3 * 320 + 110}px`,
	gap: "20px",
	waitForTransition: false,
	padding: "18px",
	breakpoints: {
		1230: {
			perPage: 2,
			focus: 1,
			width: `${2 * 320 + 110}px`,
		},
		970: {
			perPage: 1,
			width: `${440}px`,
		}
	}
});
splide.mount();

// #endregion