import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../core/theme/daytrace_theme.dart';
import 'widgets/theme_selector_card.dart';

class MoreScreen extends ConsumerWidget {
  const MoreScreen({super.key});

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
              'Settings & More',
              style: themeTokens.typography.headlineMd.copyWith(
                color: themeTokens.onSurface,
                fontWeight: FontWeight.bold,
              ),
            ),
            centerTitle: false,
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
                _buildSectionHeader(themeTokens, 'Appearance'),
                const SizedBox(height: 12),
                const ThemeSelectorCard(),
                
                const SizedBox(height: 32),
                
                _buildSectionHeader(themeTokens, 'Account & Data'),
                const SizedBox(height: 12),
                _buildActionCard(
                  tokens: themeTokens,
                  icon: Icons.person_outline,
                  title: 'Account Settings',
                  onTap: () {},
                ),
                const SizedBox(height: 8),
                _buildActionCard(
                  tokens: themeTokens,
                  icon: Icons.backup_outlined,
                  title: 'Backup & Restore',
                  onTap: () {},
                ),
                
                const SizedBox(height: 32),
                
                _buildSectionHeader(themeTokens, 'About'),
                const SizedBox(height: 12),
                _buildActionCard(
                  tokens: themeTokens,
                  icon: Icons.info_outline,
                  title: 'About DayTrace',
                  subtitle: 'Version 1.0.0 (Native)',
                  onTap: () {},
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(DayTraceThemeTokens tokens, String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4.0),
      child: Text(
        title.toUpperCase(),
        style: tokens.typography.labelSm.copyWith(
          color: tokens.onSurfaceVariant,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildActionCard({
    required DayTraceThemeTokens tokens,
    required IconData icon,
    required String title,
    String? subtitle,
    required VoidCallback onTap,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            child: Ink(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: tokens.surface.withValues(alpha: 0.8),
                border: Border.all(color: tokens.outlineVariant.withValues(alpha: 0.6)),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: tokens.surfaceContainer,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(icon, color: tokens.onSurface),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: tokens.typography.bodyLg.copyWith(
                            color: tokens.onSurface,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        if (subtitle != null) ...[
                          const SizedBox(height: 2),
                          Text(
                            subtitle,
                            style: tokens.typography.bodySm.copyWith(
                              color: tokens.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  Icon(Icons.chevron_right, color: tokens.onSurfaceVariant),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
