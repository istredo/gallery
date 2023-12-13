import React from "react";

function App() {

	const testList = [
		{ id: 0, url: "/img/test/0.JPG" },
		{ id: 1, url: "/img/test/1.JPG" },
		{ id: 2, url: "/img/test/2.JPG" },
		{ id: 3, url: "/img/test/3.JPG" },
		{ id: 4, url: "/img/test/4.JPG" },
		{ id: 5, url: "/img/test/5.JPG" },
		{ id: 6, url: "/img/test/6.JPG" },
		{ id: 7, url: "/img/test/7.JPG" },
	];

	let [change, setChange] = React.useState(0);


	const trackRef = React.useRef();
	let track
	React.useEffect(() => {
		track = trackRef.current
		const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

		const handleOnUp = () => {
			track.dataset.mouseDownAt = "0";
			track.dataset.prevPercentage = track.dataset.percentage;
		}

		const handleOnMove = e => {
			if (track.dataset.mouseDownAt === "0") return;

			const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
				maxDelta = window.innerWidth / 2;

			const percentage = (mouseDelta / maxDelta) * -100,
				nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
				nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

			track.dataset.percentage = nextPercentage;

			track.animate({
				transform: `translate(${nextPercentage}%, -20%)`
			}, { duration: 1200, fill: "forwards" });

			for (const image of track.getElementsByClassName("image")) {
				image.animate({
					objectPosition: `${100 + nextPercentage}% center`
				}, { duration: 1200, fill: "forwards" });
			}

		}

		const handleWheel = e => {
			setChange(change + e.wheelDelta)
			if (change < -1920) {
				setChange(-1920)
			} else if (change > 0) {
				setChange(0)
			}
			track.animate({
				transform: `translate(${change / 20}%, -20%)`
			}, { duration: 500, fill: "forwards" });
			for (const image of track.getElementsByClassName("image")) {
				image.animate({
					objectPosition: `${100 + change / 20}% center`
				}, { duration: 500, fill: "forwards" });
			}
		}


		window.onmousedown = e => handleOnDown(e);

		window.ontouchstart = e => handleOnDown(e.touches[0]);

		window.onmouseup = e => handleOnUp(e);

		window.ontouchend = e => handleOnUp(e.touches[0]);

		window.onmousemove = e => handleOnMove(e);

		window.ontouchmove = e => handleOnMove(e.touches[0]);

		window.onwheel = e => handleWheel(e)
	},)


	return (
		<div className="App">
			<div className="wrapper">
				<h1>Happy new year</h1>
				<span>drag or scroll photos</span>
				<div ref={trackRef} className="image__container" id="image-track" data-mouse-down-at="0" data-prev-percentage="0">
					{testList.map((item) => (
						<img
							className="image"
							alt="best-photo"
							key={item.id}
							src={item.url}
							draggable="false"
						/>
					))}
				</div>
			</div>
		</div >
	);
}

export default App;
