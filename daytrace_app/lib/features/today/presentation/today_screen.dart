import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/theme_provider.dart';
import 'widgets/today_greeting.dart';
import 'widgets/today_metrics_grid.dart';
import 'widgets/live_focus_card.dart';
import 'widgets/planning_cutoff_banner.dart';
import 'widgets/today_schedule.dart';

class TodayScreen extends ConsumerWidget {
  const TodayScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeTokens = ref.watch(themeProvider.notifier).tokens;

    return Scaffold(
      backgroundColor: Colors.transparent, // Background provided by AppShell
      body: CustomScrollView(
        slivers: [
          // Frosted Glass Header
          SliverAppBar(
            pinned: true,
            backgroundColor: themeTokens.background.withValues(alpha: 0.75),
            flexibleSpace: ClipRect(
              child: BackdropFilter(
                filter: _blurFilter(),
                child: Container(
                  decoration: BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                        color: themeTokens.onSurface.withValues(alpha: 0.08),
                        width: 1,
                      ),
                    ),
                  ),
                ),
              ),
            ),
            title: Row(
              children: [
                // Placeholder for Logo
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: themeTokens.primaryContainer,
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        Text(
                          'DayTrace',
                          style: themeTokens.typography.headlineMd.copyWith(
                            color: themeTokens.onSurface,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: themeTokens.secondary,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: themeTokens.secondary.withValues(alpha: 0.6),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    Text(
                      'Today',
                      style: themeTokens.typography.labelSm.copyWith(
                        color: themeTokens.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.search),
                  color: themeTokens.onSurfaceVariant,
                  onPressed: () {},
                ),
                // Profile Avatar Placeholder
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: themeTokens.onSurface.withValues(alpha: 0.2)),
                    image: const DecorationImage(
                      image: NetworkImage('https://i.pravatar.cc/150?img=68'),
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Main Content
          SliverPadding(
            padding: const EdgeInsets.only(
              left: 16.0,
              right: 16.0,
              top: 16.0,
              bottom: 100.0, // Space for bottom nav + FAB
            ),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                const TodayGreeting(),
                const SizedBox(height: 24),
                const TodayMetricsGrid(),
                const SizedBox(height: 24),
                const LiveFocusCard(),
                const SizedBox(height: 24),
                const PlanningCutoffBanner(),
                const SizedBox(height: 24),
                const TodaySchedule(),
              ]),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: themeTokens.primary,
        foregroundColor: themeTokens.onPrimary,
        child: const Icon(Icons.add, size: 30),
      ),
      // Position FAB above the bottom nav (which is 80px high)
      floatingActionButtonLocation: _CustomFabLocation(),
    );
  }

  // Filter that can't be const
  ui.ImageFilter _blurFilter() {
    return ui.ImageFilter.blur(sigmaX: 20, sigmaY: 20);
  }
}

class _CustomFabLocation extends FloatingActionButtonLocation {
  @override
  Offset getOffset(ScaffoldPrelayoutGeometry scaffoldGeometry) {
    // 16px from right, 80px (bottom nav) + 20px from bottom
    final double x = scaffoldGeometry.scaffoldSize.width - scaffoldGeometry.floatingActionButtonSize.width - 16.0;
    final double y = scaffoldGeometry.scaffoldSize.height - scaffoldGeometry.floatingActionButtonSize.height - 100.0;
    return Offset(x, y);
  }
}
