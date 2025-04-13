import Link from 'next/link';

import { Grid } from '@/components/shared/grid';
import { BlurredImage } from '@/components/ui/blurred-image';
import { Button } from '@/components/ui/button';

import { getLikedArtists } from '../data-access';

export const LikedArtists = async () => {
	const likedArtists = await getLikedArtists();

	if (!likedArtists.length) {
		return null;
	}

	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Artists You Like</h2>
				<Button href="/artists" variant="link">
					View all artists
				</Button>
			</div>
			<Grid as="ul">
				{likedArtists.map(({ artist }) => (
					<li key={artist.id}>
						<Link
							href={`/artists/${artist.id}`}
							className="group block space-y-4 rounded-md p-4 transition-colors hover:bg-slate-800"
						>
							<div className="relative aspect-square">
								<BlurredImage
									src={artist.imageUrl}
									alt={artist.nickname}
									className="h-full w-full rounded-md object-cover"
									width={300}
									height={300}
								/>
							</div>
							<div className="space-y-1 text-sm">
								<h3 className="line-clamp-1 font-semibold capitalize">{artist.nickname}</h3>
							</div>
						</Link>
					</li>
				))}
			</Grid>
		</>
	);
};
