"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Calendar, MessageSquare, Hash, RefreshCw, Search, Filter, User, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EmailData {
  id: string;
  thread_subject: string;
  gmail_thread_id: string;
  ai_reply: string;
  created_at: string;
  from_email: string;
  to_email: string;
  original_message: string;
  thread_history: string;
  message_id: string;
  processed_at: string;
  status: string;
}

export default function EmailDashboard() {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [refreshing, setRefreshing] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  const supabase = createClient();

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('email_agent_new')
        .select('*');

      // Apply sorting
      if (sortBy === 'created_at') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'thread_subject') {
        query = query.order('thread_subject', { ascending: true });
      } else if (sortBy === 'from_email') {
        query = query.order('from_email', { ascending: true });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setEmails(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEmails();
    setRefreshing(false);
  };

  const toggleThreadExpansion = (threadId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(threadId)) {
      newExpanded.delete(threadId);
    } else {
      newExpanded.add(threadId);
    }
    setExpandedThreads(newExpanded);
  };

  useEffect(() => {
    fetchEmails();

    // Set up real-time subscription
    const channel = supabase
      .channel('email_agent_new_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'email_agent_new'
        },
        () => {
          fetchEmails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sortBy]);

  // Filter emails based on search term
  const filteredEmails = emails.filter(email =>
    email.thread_subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.gmail_thread_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.ai_reply.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.original_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique senders for statistics
  const uniqueSenders = new Set(emails.map(email => email.from_email)).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading emails...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails, senders, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Sort by Date (Newest)</SelectItem>
              <SelectItem value="thread_subject">Sort by Subject</SelectItem>
              <SelectItem value="from_email">Sort by Sender</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Threads</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emails.length}</div>
            <p className="text-xs text-muted-foreground">
              Email threads processed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Replies</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emails.length}</div>
            <p className="text-xs text-muted-foreground">
              AI-generated responses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Senders</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSenders}</div>
            <p className="text-xs text-muted-foreground">
              Different email senders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emails.length > 0 
                ? new Date(emails[0].processed_at || emails[0].created_at).toLocaleDateString()
                : 'No data'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent email processed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Email List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Email Threads</h2>
          <Badge variant="secondary">
            {filteredEmails.length} of {emails.length} emails
          </Badge>
        </div>
        
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error loading emails: {error}</p>
            </CardContent>
          </Card>
        )}
        
        {filteredEmails.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm ? 'No emails found' : 'No emails found'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Try adjusting your search terms.'
                    : 'Your email agent hasn\'t processed any emails yet.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEmails.map((email) => (
              <Card key={email.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{email.thread_subject}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {email.from_email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {email.gmail_thread_id}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(email.processed_at || email.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                                         <div className="flex items-center gap-2">
                       <Badge variant="outline">AI Reply</Badge>
                       <Badge variant="secondary">{email.status}</Badge>
                       {email.thread_history && (
                         <Badge variant="outline" className="text-xs">
                           {email.thread_history.split('---').length} messages
                         </Badge>
                       )}
                     </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Original Message */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Original Message:
                      </h4>
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <p className="whitespace-pre-wrap line-clamp-3">
                          {email.original_message}
                        </p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        AI Response:
                      </h4>
                      <div className="bg-green-50 p-3 rounded-md text-sm border-l-4 border-green-500 text-green-900">
                        <p className="whitespace-pre-wrap">{email.ai_reply}</p>
                      </div>
                    </div>

                                         {/* Thread History (Collapsible) */}
                     {email.thread_history ? (
                       <Collapsible 
                         open={expandedThreads.has(email.id)}
                         onOpenChange={() => toggleThreadExpansion(email.id)}
                       >
                         <CollapsibleTrigger asChild>
                           <Button variant="ghost" size="sm" className="w-full justify-between">
                             <span>View Full Conversation History ({email.thread_history.split('---').length} messages)</span>
                             <span>{expandedThreads.has(email.id) ? '−' : '+'}</span>
                           </Button>
                         </CollapsibleTrigger>
                         <CollapsibleContent className="mt-2">
                           <div className="bg-gray-50 p-3 rounded-md text-sm border">
                             <h5 className="font-medium mb-2 text-gray-700">Full Conversation History:</h5>
                             <div className="space-y-3 max-h-80 overflow-y-auto">
                               {email.thread_history.split('---').map((part, index) => (
                                 <div key={index} className="p-3 bg-white rounded border-l-4 border-blue-300 shadow-sm">
                                   <div className="text-xs text-gray-500 mb-1">
                                     Message {index + 1}
                                   </div>
                                   <pre className="whitespace-pre-wrap text-xs text-gray-800 leading-relaxed">{part.trim()}</pre>
                                 </div>
                               ))}
                             </div>
                           </div>
                         </CollapsibleContent>
                       </Collapsible>
                     ) : (
                       <div className="text-sm text-gray-500 italic">
                         No thread history available
                       </div>
                     )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
