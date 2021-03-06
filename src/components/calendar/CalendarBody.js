import CalendarRow from "./CalendarRow";

export default function CalendarBody({ weeks, events, onEventClick }) {
	if (weeks) {
		return (
			<div className="border dark:border-dark-gray-600 rounded-md text-center">
				<CalendarRow
					days={weeks[0]}
					className="border-b dark:border-dark-gray-600"
					events={events}
					onEventClick={onEventClick}
				/>
				<CalendarRow
					days={weeks[1]}
					className="border-b dark:border-dark-gray-600"
					events={events}
					onEventClick={onEventClick}
				/>
				<CalendarRow
					days={weeks[2]}
					className="border-b dark:border-dark-gray-600"
					events={events}
					onEventClick={onEventClick}
				/>
				<CalendarRow
					days={weeks[3]}
					className="border-b dark:border-dark-gray-600"
					events={events}
					onEventClick={onEventClick}
				/>
				{weeks[4][0] && <CalendarRow days={weeks[4]} events={events} onEventClick={onEventClick} />}
				{weeks[5][0] && (
					<CalendarRow
						days={weeks[5]}
						className="border-t dark:border-dark-gray-600"
						events={events}
						onEventClick={onEventClick}
					/>
				)}
			</div>
		);
	} else {
		return null;
	}
}
