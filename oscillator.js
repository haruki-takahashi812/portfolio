function initOscillator(remove) {


	if (!remove) {

		let ctx;
		let hue;
		let logo;
		let form;
		let buffer;
		let target = {}
		let tendrils = []
		let settings = {
			debug: false,
			friction: 0.5,
			trails: 30,
			size: 50,
			dampening: 0.25,
			tension: 0.98
		}


		Math.TWO_PI = Math.PI * 2;

		// ========================================================================================
		// Oscillator
		// ----------------------------------------------------------------------------------------

		function Oscillator(options) {
			this.init(options || {});
		}

		Oscillator.prototype = (function () {

			let value = 0;

			return {

				init: function (options) {
					this.phase = options.phase || 0;
					this.offset = options.offset || 0;
					this.frequency = options.frequency || 0.001;
					this.amplitude = options.amplitude || 1;
				},

				update: function () {
					this.phase += this.frequency;
					value = this.offset + Math.sin(this.phase) * this.amplitude;
					return value;
				},

				value: function () {
					return value;
				}
			};

		})();

		// ========================================================================================
		// Tendril
		// ----------------------------------------------------------------------------------------

		function Tendril(options) {
			this.init(options || {});
		}

		Tendril.prototype = (function () {

			function Node() {
				this.x = 0;
				this.y = 0;
				this.vy = 0;
				this.vx = 0;
			}

			return {

				init: function (options) {

					this.spring = options.spring + (Math.random() * 0.1) - 0.05;
					this.friction = settings.friction + (Math.random() * 0.01) - 0.005;
					this.nodes = [];

					for (let i = 0, node; i < settings.size; i++) {

						node = new Node();
						node.x = target.x;
						node.y = target.y;

						this.nodes.push(node);
					}
				},

				update: function () {

					let spring = this.spring,
						node = this.nodes[0];

					node.vx += (target.x - node.x) * spring;
					node.vy += (target.y - node.y) * spring;

					for (let prev, i = 0, n = this.nodes.length; i < n; i++) {

						node = this.nodes[i];

						if (i > 0) {

							prev = this.nodes[i - 1];

							node.vx += (prev.x - node.x) * spring;
							node.vy += (prev.y - node.y) * spring;
							node.vx += prev.vx * settings.dampening;
							node.vy += prev.vy * settings.dampening;
						}

						node.vx *= this.friction;
						node.vy *= this.friction;
						node.x += node.vx;
						node.y += node.vy;

						spring *= settings.tension;
					}
				},

				draw: function () {

					let x = this.nodes[0].x,
						y = this.nodes[0].y,
						a,
						b;

					ctx.beginPath();
					ctx.moveTo(x, y);

					// must be var not let 
					for (var i = 1, n = this.nodes.length - 2; i < n; i++) {

						a = this.nodes[i];
						b = this.nodes[i + 1];
						x = (a.x + b.x) * 0.5;
						y = (a.y + b.y) * 0.5;

						ctx.quadraticCurveTo(a.x, a.y, x, y);
					}

					a = this.nodes[i];
					b = this.nodes[i + 1];

					ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
					ctx.stroke();
					ctx.closePath();
				}
			};

		})();

		// ----------------------------------------------------------------------------------------

		function init(event) {

			document.removeEventListener('mousemove', init);
			document.removeEventListener('touchstart', init);

			document.addEventListener('mousemove', mousemove);
			document.addEventListener('touchmove', mousemove);
			document.addEventListener('touchstart', touchstart);

			mousemove(event);
			reset();
			loop();
		}

		function reset() {

			tendrils = [];

			for (let i = 0; i < settings.trails; i++) {

				tendrils.push(new Tendril({
					spring: 0.45 + 0.025 * (i / settings.trails)
				}));
			}
		}

		let rasenShurikenActive = false;
		let rasenShurikenHoldStart = 0;
		let rasenShurikenHoldDuration = 0;

		function drawRasengan(x, y, frame) {
    // More anime-like: layered spirals, wind aura, richer gradients
    const r1 = 28 + 4 * Math.sin(frame / 8);
    const r2 = 16 + 2 * Math.cos(frame / 6);
    const r3 = 8 + 1 * Math.sin(frame / 4);

    // Outer wind aura
    let grad = ctx.createRadialGradient(x, y, r2, x, y, r1 * 2.2);
    grad.addColorStop(0, 'rgba(120,200,255,0.13)');
    grad.addColorStop(0.7, 'rgba(120,200,255,0.07)');
    grad.addColorStop(1, 'rgba(120,200,255,0)');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.arc(x, y, r1 * 2.2, 0, Math.TWO_PI);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.filter = 'blur(4px)';
    ctx.fill();
    ctx.restore();

    // Main blue orb
    grad = ctx.createRadialGradient(x, y, r3, x, y, r2 * 1.2);
    grad.addColorStop(0, 'rgba(255,255,255,0.98)');
    grad.addColorStop(0.3, 'rgba(120,200,255,0.8)');
    grad.addColorStop(1, 'rgba(0,120,255,0.32)');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.arc(x, y, r2 * 1.2, 0, Math.TWO_PI);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.filter = 'blur(1.2px)';
    ctx.fill();
    ctx.restore();

    // Multiple swirling spiral arms
    for (let arm = 0; arm < 3; arm++) {
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.strokeStyle = `rgba(120,200,255,0.7)`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        let spiralAngle = frame / (10 + arm * 2) + arm * Math.PI * 2 / 3;
        for (let t = 0; t < Math.PI * 2 * 1.7; t += 0.09) {
            let rad = 7 + 8 * t / (Math.PI * 2 * 1.7) + 2 * Math.sin(t * 2 + spiralAngle);
            let px = x + Math.cos(t + spiralAngle) * rad;
            let py = y + Math.sin(t + spiralAngle) * rad;
            if (t === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
    }

    // Swirling energy lines (wind)
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = 'rgba(120,200,255,0.7)';
    ctx.lineWidth = 4.5;
    for (let i = 0; i < 4; i++) {
        let angle = (frame / 18) + (i * Math.PI * 2 / 4);
        ctx.beginPath();
        for (let t = 0; t < Math.PI * 2; t += 0.18) {
            let rad = r2 * 1.2 + 10 * Math.sin(2 * t + angle);
            let px = x + Math.cos(t + angle) * rad;
            let py = y + Math.sin(t + angle) * rad;
            if (t === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }
    ctx.restore();
}

function drawRasenShuriken(x, y, frame, holdDuration) {
    // Pure Rasengan: glowing orb with swirling energy, wind effects, grows when held
    let scale = 1 + Math.min(holdDuration / 1500, 1.2); // Max 2.2x scale
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = 0.8;
    ctx.globalCompositeOperation = 'lighter';
    let spin = frame / 6;
    
    // --- Glowing Rasengan core orb ---
    let r1 = 28 + 4 * Math.sin(frame / 8);
    let r2 = 16 + 2 * Math.cos(frame / 6);
    let r3 = 8 + 1 * Math.sin(frame / 4);
    
    // Outer wind aura
    let grad = ctx.createRadialGradient(0, 0, r2, 0, 0, r1 * 2.2);
    grad.addColorStop(0, 'rgba(120,200,255,0.13)');
    grad.addColorStop(0.7, 'rgba(120,200,255,0.07)');
    grad.addColorStop(1, 'rgba(120,200,255,0)');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.arc(0, 0, r1 * 2.2, 0, Math.TWO_PI);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.filter = 'blur(4px)';
    ctx.fill();
    ctx.restore();
    
    // Main blue orb
    grad = ctx.createRadialGradient(0, 0, r3, 0, 0, r2 * 1.2);
    grad.addColorStop(0, 'rgba(255,255,255,0.98)');
    grad.addColorStop(0.3, 'rgba(120,200,255,0.8)');
    grad.addColorStop(1, 'rgba(0,120,255,0.32)');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.arc(0, 0, r2 * 1.2, 0, Math.TWO_PI);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.filter = 'blur(1.2px)';
    ctx.fill();
    ctx.restore();
    
    // --- Multiple swirling spiral arms in the core ---
    for (let arm = 0; arm < 3; arm++) {
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.strokeStyle = `rgba(120,200,255,0.7)`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        let spiralAngle = frame / (10 + arm * 2) + arm * Math.PI * 2 / 3;
        for (let t = 0; t < Math.PI * 2 * 1.7; t += 0.09) {
            let rad = 7 + 8 * t / (Math.PI * 2 * 1.7) + 2 * Math.sin(t * 2 + spiralAngle);
            let px = Math.cos(t + spiralAngle) * rad;
            let py = Math.sin(t + spiralAngle) * rad;
            if (t === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
    }
    
    // --- Swirling energy lines (wind) ---
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = 'rgba(120,200,255,0.7)';
    ctx.lineWidth = 4.5;
    for (let i = 0; i < 4; i++) {
        let angle = (frame / 18) + (i * Math.PI * 2 / 4);
        ctx.beginPath();
        for (let t = 0; t < Math.PI * 2; t += 0.18) {
            let rad = r2 * 1.2 + 10 * Math.sin(2 * t + angle);
            let px = Math.cos(t + angle) * rad;
            let py = Math.sin(t + angle) * rad;
            if (t === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }
    ctx.restore();
    
    ctx.restore();
}

		function loop() {

			if (!ctx.running) return;

			ctx.globalCompositeOperation = 'source-over';
			// ctx.fillStyle = '#1D1D1D';
			ctx.fillStyle = 'rgba(0, 0, 0, 0)';
			// ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.globalCompositeOperation = 'lighter';
			// ctx.strokeStyle = 'hsla(346,98%,56%,0.25)';
			ctx.lineWidth = 1.2;
			// ctx.strokeStyle = 'hsla(171,50%,50%,0.5)';
			// color of brush
			// ctx.strokeStyle = 'hsla(171,50%,80%,0.5)'; // cyan
			// ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // white
			ctx.strokeStyle = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.strokeStyle.addColorStop(0, '#b3e0ff');
			ctx.strokeStyle.addColorStop(0.5, '#2196f3');
			ctx.strokeStyle.addColorStop(1, '#0057b8');

			for (let i = 0, tendril; i < settings.trails; i++) {
				tendril = tendrils[i];
				tendril.update();
				tendril.draw();
			}

			// Draw Rasengan at mouse
			if (target.x && target.y) {
				if (rasenShurikenActive) {
					rasenShurikenHoldDuration = Date.now() - rasenShurikenHoldStart;
					drawRasenShuriken(target.x, target.y, ctx.frame, rasenShurikenHoldDuration);
				} else {
					drawRasengan(target.x, target.y, ctx.frame);
				}
			}

			ctx.frame++;
			requestAnimFrame(loop);
		}

		function resize() {
			// ctx.canvas.width = window.innerWidth;
			// ctx.canvas.height = window.innerHeight;

			ctx.canvas.width = oscCanvas.clientWidth;
			ctx.canvas.height = oscCanvas.clientHeight;
		}

		function start() {
			if (!ctx.running) {
				ctx.running = true;
				loop();
			}
		}

		function stop() {
			ctx.running = false;
		}

		function mousemove(event) {
			if (event.touches) {
				target.x = event.touches[0].pageX;
				target.y = event.touches[0].pageY;
			} else {
				target.x = event.clientX
				target.y = event.clientY;
			}
			event.preventDefault();
		}

		function touchstart(event) {
			if (event.touches.length == 1) {
				target.x = event.touches[0].pageX;
				target.y = event.touches[0].pageY;
			}
		}

		function keyup(event) {

			switch (event.keyCode) {
				case 32:
					save();
					break;
				default:
			}
		}

		function save() {

			if (!buffer) {

				buffer = document.createElement('canvas');
				buffer.width = screen.availWidth;
				buffer.height = screen.availHeight;
				buffer.ctx = buffer.getContext('2d');

				form = document.createElement('form');
				form.method = 'post';
				form.input = document.createElement('input');
				form.input.type = 'hidden';
				form.input.name = 'data';
				form.appendChild(form.input);

				document.body.appendChild(form);
			}

			// buffer.ctx.fillStyle = 'rgba(8,5,16)';
			buffer.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
			buffer.ctx.fillRect(0, 0, buffer.width, buffer.height);

			buffer.ctx.drawImage(canvas,
				Math.round(buffer.width / 2 - canvas.width / 2),
				Math.round(buffer.height / 2 - canvas.height / 2)
			);


			window.open(buffer.toDataURL(), 'wallpaper', 'top=0,left=0,width=' + buffer.width + ',height=' + buffer.height);

			// form.input.value = buffer.toDataURL().substr(22);
			// form.submit();
		}

		window.requestAnimFrame = (function () {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (fn) {
				window.setTimeout(fn, 1000 / 60)
			};
		})();

		const oscCanvas = document.querySelector("#oscillatorCanvas")

		ctx = oscCanvas.getContext('2d');

		ctx.running = true;
		ctx.frame = 1;


		hue = new Oscillator({
			phase: Math.random() * Math.TWO_PI,
			amplitude: 85,
			frequency: 0.0015,
			offset: 285
		});

		document.addEventListener('mousemove', init);
		document.addEventListener('touchstart', init);
		document.body.addEventListener('orientationchange', resize);
		window.addEventListener('resize', resize);
		window.addEventListener('focus', start);
		window.addEventListener('blur', stop);
		// Rasenshuriken activation
		window.addEventListener('mousedown', () => {
			rasenShurikenActive = true;
			rasenShurikenHoldStart = Date.now();
		});
		window.addEventListener('mouseup', () => {
			rasenShurikenActive = false;
			rasenShurikenHoldDuration = 0;
		});
		window.addEventListener('touchstart', () => {
			rasenShurikenActive = true;
			rasenShurikenHoldStart = Date.now();
		});
		window.addEventListener('touchend', () => {
			rasenShurikenActive = false;
			rasenShurikenHoldDuration = 0;
		});

		resize();

	} else {

		document.body.removeEventListener('orientationchange', resize);
		window.removeEventListener('resize', resize);
		window.removeEventListener('focus', start);
		window.removeEventListener('blur', stop);

		document.removeEventListener('mousemove', mousemove);
		document.removeEventListener('touchmove', mousemove);
		document.removeEventListener('touchstart', touchstart);


	}
}

initOscillator(false)