enum TimelineEventType { task, activity, expense, screenshot, calendarEvent }

class TimelineEvent {
  final String id;
  final TimelineEventType type;
  final String title;
  final DateTime? startTime;
  final DateTime? endTime;
  final DateTime createdAt;
  final String? category;
  final String? source;
  final String? notes;
  final Map<String, dynamic>? metadata;

  const TimelineEvent({
    required this.id,
    required this.type,
    required this.title,
    this.startTime,
    this.endTime,
    required this.createdAt,
    this.category,
    this.source,
    this.notes,
    this.metadata,
  });
}
