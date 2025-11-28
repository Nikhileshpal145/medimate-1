import { PageHeader } from '@/components/page-header';
import { HealthQuiz } from '@/app/(app)/awareness/quiz';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

export default function AwarenessPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Health Awareness Hub"
        description="Engaging content to improve health literacy."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <HealthQuiz />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Myth Busters</CardTitle>
                <CardDescription>Separating fact from fiction.</CardDescription>
            </CardHeader>
            <CardContent>
                <Image 
                    src="https://picsum.photos/seed/myth/600/400"
                    alt="Myth busting graphic"
                    width={600}
                    height={400}
                    className="rounded-lg mb-4"
                    data-ai-hint="abstract illustration"
                />
                <h3 className="font-semibold">Does cracking your knuckles cause arthritis?</h3>
                <p className="text-sm text-muted-foreground">No, this is a common myth. While it might be annoying to others, there's no scientific evidence linking it to arthritis.</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Medical Fact of the Day</CardTitle>
            </CardHeader>
            <CardContent>
                <h3 className="font-semibold">Your brain is more active at night.</h3>
                <p className="text-sm text-muted-foreground">Contrary to popular belief, your brain is more active when you sleep than when you're awake. It's busy processing information, consolidating memories, and cleaning out toxins.</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Weekly Health Tip</CardTitle>
            </CardHeader>
            <CardContent>
                <h3 className="font-semibold">Stay Hydrated</h3>
                <p className="text-sm text-muted-foreground">Drinking enough water is crucial for energy levels and brain function. Aim for 8 glasses a day, more if you're active or it's hot outside.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
