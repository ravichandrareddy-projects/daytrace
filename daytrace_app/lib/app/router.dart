import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../core/widgets/daytrace_app_shell.dart';
import '../features/today/presentation/today_screen.dart';
import '../features/timeline/presentation/timeline_screen.dart';
import '../features/money/presentation/money_screen.dart';
import '../features/memory/presentation/memory_screen.dart';
import '../features/more/presentation/more_screen.dart';

part 'router.g.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');
final _shellNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'shell');

@riverpod
GoRouter router(Ref ref) {
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/today',
    routes: [
      // Shell route for the persistent navigation and background shader
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) {
          return DayTraceAppShell(child: child);
        },
        routes: [
          GoRoute(
            path: '/today',
            builder: (context, state) => const TodayScreen(),
          ),
          GoRoute(
            path: '/timeline',
            builder: (context, state) => const TimelineScreen(),
          ),
          GoRoute(
            path: '/money',
            builder: (context, state) => const MoneyScreen(),
          ),
          GoRoute(
            path: '/memory',
            builder: (context, state) => const MemoryScreen(),
          ),
          GoRoute(
            path: '/more',
            builder: (context, state) => const MoreScreen(),
          ),
        ],
      ),
      
      // Secondary routes outside the shell (no bottom nav)
      GoRoute(
        path: '/task/new',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const Scaffold(body: Center(child: Text('Add Task'))),
      ),
      GoRoute(
        path: '/activity/new',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const Scaffold(body: Center(child: Text('Add Activity'))),
      ),
      GoRoute(
        path: '/expense/new',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const Scaffold(body: Center(child: Text('Add Expense'))),
      ),
      GoRoute(
        path: '/memory/:id',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => Scaffold(body: Center(child: Text('Memory Detail: ${state.pathParameters['id']}'))),
      ),
      GoRoute(
        path: '/settings',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const Scaffold(body: Center(child: Text('Settings'))),
        routes: [
          GoRoute(
            path: 'appearance',
            parentNavigatorKey: _rootNavigatorKey,
            builder: (context, state) => const Scaffold(body: Center(child: Text('Appearance Settings'))),
          ),
        ],
      ),
      // Future routes for review, calculator, search etc.
    ],
  );
}
