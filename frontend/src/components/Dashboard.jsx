import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Stack,
  IconButton,
  Skeleton,
  Paper,
  Fade,
  Button,
  Tooltip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { supabase } from '../supabaseClient';
import { Trash2, Calendar, FileText, ChevronRight, Plus, BarChart3 } from 'lucide-react';
import { useLanguageContext } from '../contexts/LanguageContext';

function Dashboard({ onSelectReport, onCreateReport }) {
  const { isEnglish } = useLanguageContext();
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReports(data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (event, id) => {
    event.stopPropagation();
    if (!window.confirm(isEnglish ? 'Delete this report?' : '确定要删除这份报告吗？')) return;

    try {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (error) throw error;
      setReports(reports.filter((report) => report.id !== id));
    } catch (error) {
      console.error(error);
      alert(isEnglish ? 'Delete failed' : '删除失败');
    }
  };

  if (loading) {
    return (
      <Box sx={{ px: { xs: 2.5, sm: 4, lg: 6 }, py: { xs: 4, md: 6 }, maxWidth: 1280, mx: 'auto' }}>
        <Skeleton variant="text" width={220} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={300} height={24} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
              <Skeleton variant="rounded" height={210} sx={{ borderRadius: '14px' }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Fade in>
      <Box sx={{ px: { xs: 2.5, sm: 4, lg: 6 }, py: { xs: 4, md: 6 }, maxWidth: 1280, mx: 'auto' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
              {isEnglish ? 'My Reports' : '我的报告'}
            </Typography>
            <Typography color="text.secondary">
              {isEnglish
                ? `${reports.length} saved interview ${reports.length === 1 ? 'report' : 'reports'}`
                : `共保存 ${reports.length} 份面试报告`}
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<Plus size={18} aria-hidden="true" />} onClick={onCreateReport}>
            {isEnglish ? 'New report' : '新建报告'}
          </Button>
        </Stack>

        {reports.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              px: 3,
              py: { xs: 7, md: 9 },
              textAlign: 'center',
              borderRadius: '16px',
              borderStyle: 'dashed',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ width: 56, height: 56, borderRadius: '16px', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'grid', placeItems: 'center', mx: 'auto', mb: 2 }}>
              <FileText size={27} aria-hidden="true" />
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {isEnglish ? 'No reports yet' : '还没有面试报告'}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {isEnglish ? 'Create your first tailored interview preparation report.' : '创建第一份针对目标岗位的面试准备报告。'}
            </Typography>
            <Button variant="contained" startIcon={<Plus size={18} aria-hidden="true" />} onClick={onCreateReport}>
              {isEnglish ? 'Create first report' : '创建第一份报告'}
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {reports.map((report) => {
              const score = Number(report.match_report?.overall_score) || 0;
              return (
                <Grid item xs={12} sm={6} lg={4} key={report.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      position: 'relative',
                      borderColor: 'divider',
                      transition: 'border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
                      '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.45),
                        transform: 'translateY(-2px)',
                        boxShadow: theme.palette.mode === 'dark' ? '0 16px 36px rgba(0,0,0,0.2)' : '0 14px 34px rgba(15,23,42,0.08)',
                      },
                    }}
                  >
                    <Tooltip title={isEnglish ? 'Delete report' : '删除报告'}>
                      <IconButton
                        onClick={(event) => handleDelete(event, report.id)}
                        aria-label={isEnglish ? 'Delete report' : '删除报告'}
                        sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.08) } }}
                      >
                        <Trash2 size={17} />
                      </IconButton>
                    </Tooltip>

                    <CardActionArea onClick={() => onSelectReport(report)} sx={{ height: '100%', p: 0.5 }}>
                      <CardContent sx={{ p: 2.5, pr: 7 }}>
                        <Box sx={{ width: 42, height: 42, borderRadius: '12px', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'grid', placeItems: 'center', mb: 2.5 }}>
                          <BarChart3 size={20} aria-hidden="true" />
                        </Box>

                        <Typography variant="h6" sx={{ mb: 1, overflowWrap: 'anywhere' }}>
                          {report.job_title || (isEnglish ? 'Interview report' : '面试报告')}
                        </Typography>

                        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary', mb: 2.5 }}>
                          <Calendar size={14} aria-hidden="true" />
                          <Typography variant="caption">
                            {new Date(report.created_at).toLocaleDateString(isEnglish ? 'en-US' : 'zh-CN')}
                          </Typography>
                        </Stack>

                        <Box sx={{ mb: 2.5 }}>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                            <Typography variant="caption" color="text.secondary">
                              {isEnglish ? 'Match score' : '匹配得分'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 750, fontVariantNumeric: 'tabular-nums' }}>
                              {score}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={Math.max(0, Math.min(100, score))}
                            aria-label={`${isEnglish ? 'Match score' : '匹配得分'} ${score}%`}
                            sx={{ height: 7, borderRadius: '999px', bgcolor: alpha(theme.palette.primary.main, 0.1), '& .MuiLinearProgress-bar': { borderRadius: '999px' } }}
                          />
                        </Box>

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 650 }}>
                            {isEnglish ? 'View report' : '查看报告'}
                          </Typography>
                          <ChevronRight size={18} color={theme.palette.primary.main} aria-hidden="true" />
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Fade>
  );
}

export default Dashboard;
