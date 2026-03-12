import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Grid, Card, CardContent, CardActionArea, 
  Stack, Chip, IconButton, Skeleton, Paper, Fade 
} from "@mui/material";
import { supabase } from "../supabaseClient";
import { Trash2, Calendar, FileText, ChevronRight, BarChart3 } from 'lucide-react';
import { useLanguageContext } from "../contexts/LanguageContext";

function Dashboard({ onSelectReport }) {
  const { t, isEnglish } = useLanguageContext();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 页面加载时获取数据
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
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // 防止触发卡片点击事件
    if (!window.confirm(isEnglish ? "Delete this report?" : "确定要删除这份报告吗？")) return;

    try {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (error) throw error;
      setReports(reports.filter(r => r.id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Fade in={true}>
      <Box sx={{ p: { xs: 3, md: 6 }, maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 4, letterSpacing: '-1px' }}>
          {isEnglish ? "My Reports" : "我的面试报告"}
        </Typography>

        {reports.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 10, textAlign: 'center', borderRadius: 4, borderStyle: 'dashed', bgcolor: 'transparent' }}>
            <FileText size={48} color="lightgrey" style={{ marginBottom: 16 }} />
            <Typography color="text.secondary">
              {isEnglish ? "No saved reports yet." : "暂无保存的报告。"}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {reports.map((report) => (
              <Grid item xs={12} md={6} lg={4} key={report.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 4, 
                    transition: 'all 0.3s ease', 
                    '&:hover': { 
                      borderColor: 'primary.main', 
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.05)' 
                    } 
                  }}
                >
                  <CardActionArea onClick={() => onSelectReport(report)} sx={{ p: 1 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 2, color: 'white', display: 'flex' }}>
                          <BarChart3 size={20} />
                        </Box>
                        <IconButton size="small" onClick={(e) => handleDelete(e, report.id)} sx={{ color: 'error.light' }}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Stack>
                      
                      <Typography variant="h6" fontWeight="700" noWrap sx={{ mb: 1 }}>
                        {report.job_title}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', mb: 2 }}>
                        <Calendar size={14} />
                        <Typography variant="caption">
                          {new Date(report.created_at).toLocaleDateString()}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Chip 
                          label={`Score: ${report.match_report?.overall_score}%`} 
                          size="small"
                          sx={{ fontWeight: '700', bgcolor: 'rgba(0,0,0,0.05)' }} 
                        />
                        <ChevronRight size={18} color="grey" />
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Fade>
  );
}

export default Dashboard;