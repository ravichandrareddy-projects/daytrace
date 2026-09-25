import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../core/theme/daytrace_theme.dart';

class TimelineScreen extends ConsumerWidget {
  const TimelineScreen({super.key});

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
                filter: ui.ImageFilter.blur(sigmaX: 20, sigmaY: 20),
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
            title: Text(
              'Timeline',
              style: themeTokens.typography.headlineMd.copyWith(
                color: themeTokens.onSurface,
                fontWeight: FontWeight.bold,
              ),
            ),
            centerTitle: false,
            actions: [
              IconButton(
                icon: const Icon(Icons.filter_list),
                color: themeTokens.onSurfaceVariant,
                onPressed: () {},
              ),
              const SizedBox(width: 8),
            ],
          ),
          
          // Main Content
          SliverPadding(
            padding: const EdgeInsets.only(
              left: 16.0,
              right: 16.0,
              top: 24.0,
              bottom: 100.0, // Space for bottom nav
            ),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                const SizedBox(height: 32),
                Center(
                  child: Text(
                    'No timeline events yet.',
                    style: themeTokens.typography.bodyMd.copyWith(
                      color: themeTokens.onSurfaceVariant.withValues(alpha: 0.5),
                    ),
                  ),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDateHeader(DayTraceThemeTokens tokens, String title) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: tokens.surfaceContainerHighest.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: tokens.outlineVariant.withValues(alpha: 0.5)),
      ),
      child: Text(
        title.toUpperCase(),
        style: tokens.typography.labelSm.copyWith(
          color: tokens.onSurface,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildTimelineEvent({
    required DayTraceThemeTokens tokens,
    required String time,
    required String title,
    required String description,
    required IconData icon,
    required Color color,
    required bool isLast,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Timeline indicator column
          SizedBox(
            width: 40,
            child: Column(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                    border: Border.all(color: color.withValues(alpha: 0.5)),
                  ),
                  child: Icon(icon, size: 16, color: color),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      color: tokens.outlineVariant.withValues(alpha: 0.5),
                    ),
                  ),
                if (isLast)
                  const SizedBox(height: 16), // Padding at bottom of last item
              ],
            ),
          ),
          const SizedBox(width: 12),
          // Event content card
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24.0),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: BackdropFilter(
                  filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: tokens.surface.withValues(alpha: 0.8),
                      border: Border.all(color: tokens.outlineVariant.withValues(alpha: 0.6)),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              time,
                              style: tokens.typography.labelSm.copyWith(
                                color: color,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          title,
                          style: tokens.typography.bodyLg.copyWith(
                            color: tokens.onSurface,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          description,
                          style: tokens.typography.bodySm.copyWith(
                            color: tokens.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
