
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code, Copy, ExternalLink, Globe, Link } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EmbedMarketplace = () => {
  const { toast } = useToast();
  const [clientSlug, setClientSlug] = useState('visitkileen');
  const [copied, setCopied] = useState(false);
  
  const baseUrl = window.location.origin;
  const marketplaceUrl = `${baseUrl}/client/${clientSlug}`;
  const iframeCode = `<iframe src="${marketplaceUrl}" width="100%" height="800" style="border: none; width: 100%;" title="${clientSlug} Marketplace"></iframe>`;
  const apiExample = `fetch('${baseUrl}/functions/v1/marketplace-api/venues?client=${clientSlug}')\n  .then(response => response.json())\n  .then(data => console.log(data))`;
  
  const handleCopy = (text: string, what: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: `${what} copied to clipboard`,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Embed Your Marketplace</h1>
      <p className="text-gray-600 mb-8">
        Share your marketplace with clients by embedding it on your website or using our API to integrate with your systems.
      </p>
      
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Marketplace Client</label>
        <div className="flex gap-3">
          <Input 
            value={clientSlug} 
            onChange={(e) => setClientSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="client-slug"
            className="max-w-xs"
          />
          <Button 
            onClick={() => window.open(`/client/${clientSlug}`, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Preview
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          The unique identifier for your marketplace. Use lowercase letters, numbers, and hyphens only.
        </p>
      </div>
      
      <Tabs defaultValue="embed">
        <TabsList>
          <TabsTrigger value="embed" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Embed Code
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            API Access
          </TabsTrigger>
          <TabsTrigger value="link" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Direct Link
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="embed" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Embed on Your Website</CardTitle>
              <CardDescription>
                Copy this code and paste it into your website's HTML to embed the marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <pre className="text-sm"><code>{iframeCode}</code></pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleCopy(iframeCode, "Embed code")} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy Code
              </Button>
            </CardFooter>
          </Card>
          
          <Alert className="mt-6 bg-amber-50 border-amber-200">
            <AlertDescription>
              <strong>Note:</strong> You can adjust the width and height in the iframe code to fit your website's layout.
              The marketplace will automatically adapt to the available space.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="api" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Access via API</CardTitle>
              <CardDescription>
                Use our API to integrate the marketplace data with your own applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">Available Endpoints</h3>
              <ul className="list-disc ml-5 mb-4 space-y-1">
                <li><code>/functions/v1/marketplace-api/venues?client={clientSlug}</code> - Get all venues</li>
                <li><code>/functions/v1/marketplace-api/vendors?client={clientSlug}</code> - Get all vendors</li>
                <li><code>/functions/v1/marketplace-api/preferred-venues?client={clientSlug}</code> - Get preferred venues</li>
                <li><code>/functions/v1/marketplace-api/preferred-vendors?client={clientSlug}</code> - Get preferred vendors</li>
                <li><code>/functions/v1/marketplace-api/client?client={clientSlug}</code> - Get client details</li>
              </ul>
              
              <h3 className="font-medium mt-4 mb-2">Example</h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <pre className="text-sm"><code>{apiExample}</code></pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleCopy(apiExample, "API example")} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy Example
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="link" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Direct Link</CardTitle>
              <CardDescription>
                Share this direct link to your marketplace with clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <code className="break-all">{marketplaceUrl}</code>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => handleCopy(marketplaceUrl, "Direct link")} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              <Button 
                onClick={() => window.open(marketplaceUrl, '_blank')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmbedMarketplace;
