import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/daytrace_theme.dart';
import 'dart:ui';

class DayTraceBottomNavigation extends StatelessWidget {
  const DayTraceBottomNavigation({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).extension<DayTraceThemeTokens>()!;
    final location = GoRouterState.of(context).uri.path;

    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: Container(
          height: 80,
          color: theme.navigationBackground,
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).padding.bottom,
            left: 16,
            right: 16,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _NavItem(
                icon: Icons.wb_sunny_outlined,
                activeIcon: Icons.wb_sunny,
                label: 'Today',
                isActive: location.startsWith('/today'),
                onTap: () => context.go('/today'),
                theme: theme,
              ),
              _NavItem(
                icon: Icons.schedule_outlined,
                activeIcon: Icons.schedule,
                label: 'Timeline',
                isActive: location.startsWith('/timeline'),
                onTap: () => context.go('/timeline'),
                theme: theme,
              ),
              _NavItem(
                icon: Icons.account_balance_wallet_outlined,
                activeIcon: Icons.account_balance_wallet,
                label: 'Money',
                isActive: location.startsWith('/money'),
                onTap: () => context.go('/money'),
                theme: theme,
              ),
              _NavItem(
                icon: Icons.auto_awesome_outlined,
                activeIcon: Icons.auto_awesome,
                label: 'Memory',
                isActive: location.startsWith('/memory'),
                onTap: () => context.go('/memory'),
                theme: theme,
              ),
              _NavItem(
                icon: Icons.grid_view,
                activeIcon: Icons.grid_view,
                label: 'More',
                isActive: location.startsWith('/more'),
                onTap: () => context.go('/more'),
                theme: theme,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;
  final DayTraceThemeTokens theme;

  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isActive,
    required this.onTap,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final color = isActive ? theme.primary : theme.textMuted;
    
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            isActive ? activeIcon : icon,
            color: color,
            size: 26,
          ),
          const SizedBox(height: 4),
          if (isActive)
            Container(
              width: 4,
              height: 4,
              decoration: BoxDecoration(
                color: theme.primary,
                shape: BoxShape.circle,
              ),
            ),
        ],
      ),
    );
  }
}
